from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone

from backend.app.db.session import get_db
from backend.app.models.user import User, UserRole, RefreshToken, normalize_phone
from backend.app.models.system import AuditLog
from backend.app.security.password import hash_password, verify_password
from backend.app.security.tokens import (
    create_access_token, generate_refresh_token, 
    hash_token
)
from backend.app.security.deps import (
    get_current_user, get_current_active_user, require_roles
)
from backend.app.services.sms.base import OtpService

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

# ----------------- Request / Response Schemas -----------------
class RegisterRequest(BaseModel):
    phone: str = Field(..., json_schema_extra={"example": "+91 98810 99401"})
    full_name: str = Field(..., json_schema_extra={"example": "Rukmini Vithal Jadhav"})
    full_name_mr: Optional[str] = Field(None, json_schema_extra={"example": "रुक्मिणी विठ्ठल जाधव"})
    password: str = Field(..., min_length=6, json_schema_extra={"example": "Strong#Auth_2026"})
    role: UserRole = Field(default=UserRole.ASHA)
    district: str = Field(default="Pune")
    phc: str = Field(default="Khed Shivapur Primary Health Center")
    sub_center: str = Field(default="Khed Shivapur Sub-Center")
    village: str = Field(default="Khed Shivapur")

class LoginRequest(BaseModel):
    phone: str = Field(..., json_schema_extra={"example": "+91 98810 99401"})
    password: str = Field(..., json_schema_extra={"example": "Strong#Auth_2026"})

class RefreshRequest(BaseModel):
    refresh_token: str

class OtpSendRequest(BaseModel):
    phone: str = Field(..., json_schema_extra={"example": "+91 98810 99401"})

class OtpVerifyRequest(BaseModel):
    phone: str = Field(..., json_schema_extra={"example": "+91 98810 99401"})
    otp: str = Field(..., min_length=6, max_length=6, json_schema_extra={"example": "123456"})

class ResetPasswordRequest(BaseModel):
    phone: str
    otp: str
    new_password: str = Field(..., min_length=6)

class UserStatusUpdateRequest(BaseModel):
    is_active: bool

# ----------------- Endpoints -----------------

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new frontline healthcare worker or supervisor with Argon2 password hashing.
    """
    clean_phone = normalize_phone(payload.phone)
    existing = db.query(User).filter((User.phone == clean_phone) | (User.phone == payload.phone)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this mobile number already exists."
        )

    pwd_hash = hash_password(payload.password)
    user = User(
        phone=clean_phone,
        full_name=payload.full_name,
        full_name_mr=payload.full_name_mr,
        role=payload.role,
        password_hash=pwd_hash,
        is_active=True,
        district=payload.district,
        phc=payload.phc,
        sub_center=payload.sub_center,
        village=payload.village
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Log audit event
    audit = AuditLog(
        user_id=user.id,
        action="user_registered",
        resource_type="user",
        resource_id=user.id,
        details={"role": user.role.value, "phone": user.phone}
    )
    db.add(audit)
    db.commit()

    return {
        "message": "User registered successfully.",
        "user_id": user.id,
        "phone": user.phone,
        "full_name": user.full_name,
        "role": user.role.value
    }

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates user with Argon2 password verification and issues JWT access & refresh tokens.
    """
    clean_phone = normalize_phone(payload.phone)
    user = db.query(User).filter((User.phone == clean_phone) | (User.phone == payload.phone)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact your ANM supervisor or administrator."
        )

    # 1. Create access token
    access_token, jti, exp = create_access_token(
        user_id=user.id,
        role=user.role.value,
        phone=user.phone
    )

    # 2. Create and persist refresh token
    plain_rt, rt_hash, rt_exp = generate_refresh_token()
    rt_record = RefreshToken(
        user_id=user.id,
        token_hash=rt_hash,
        jti=jti,
        expires_at=rt_exp,
        revoked=False
    )
    db.add(rt_record)

    # 3. Audit log
    audit = AuditLog(
        user_id=user.id,
        action="login_success",
        resource_type="auth",
        resource_id=user.id,
        details={"role": user.role.value}
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": plain_rt,
        "token_type": "bearer",
        "expires_at": exp.isoformat(),
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "full_name_mr": user.full_name_mr,
            "role": user.role.value,
            "district": user.district,
            "phc": user.phc,
            "sub_center": user.sub_center,
            "village": user.village
        }
    }

@router.post("/refresh")
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    """
    Rotates refresh token and issues new access token.
    Invalidates old refresh token to prevent replay attacks.
    """
    rt_hash = hash_token(payload.refresh_token)
    now = datetime.now(timezone.utc)
    
    rt_record = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == rt_hash, RefreshToken.revoked == False)
        .first()
    )
    if not rt_record or rt_record.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid or expired. Please log in again."
        )

    user = db.query(User).filter(User.id == rt_record.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Associated user account is no longer active."
        )

    # Revoke old refresh token (Token Rotation)
    rt_record.revoked = True

    # Generate new pair
    new_access, new_jti, new_exp = create_access_token(
        user_id=user.id,
        role=user.role.value,
        phone=user.phone
    )
    new_plain_rt, new_rt_hash, new_rt_exp = generate_refresh_token()
    new_rt_record = RefreshToken(
        user_id=user.id,
        token_hash=new_rt_hash,
        jti=new_jti,
        expires_at=new_rt_exp,
        revoked=False
    )
    db.add(new_rt_record)
    db.commit()

    return {
        "access_token": new_access,
        "refresh_token": new_plain_rt,
        "token_type": "bearer",
        "expires_at": new_exp.isoformat()
    }

@router.post("/logout")
def logout(payload: RefreshRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Revokes the provided refresh token and invalidates active session.
    """
    rt_hash = hash_token(payload.refresh_token)
    rt_record = db.query(RefreshToken).filter(RefreshToken.token_hash == rt_hash).first()
    if rt_record:
        rt_record.revoked = True
        db.commit()

    audit = AuditLog(
        user_id=current_user.id,
        action="logout",
        resource_type="auth",
        resource_id=current_user.id
    )
    db.add(audit)
    db.commit()

    return {"message": "Logged out successfully."}

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """
    Returns authenticated user's profile and assigned administrative boundaries.
    """
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "full_name": current_user.full_name,
        "full_name_mr": current_user.full_name_mr,
        "role": current_user.role.value,
        "district": current_user.district,
        "phc": current_user.phc,
        "sub_center": current_user.sub_center,
        "village": current_user.village,
        "created_at": current_user.created_at.isoformat()
    }

# ----------------- OTP Endpoints -----------------

@router.post("/otp/send")
def send_otp(payload: OtpSendRequest, db: Session = Depends(get_db)):
    """
    Generates and dispatches a secure random OTP with rate limits and expiry.
    """
    success, msg, dev_otp = OtpService.request_otp(db, payload.phone)
    if not success:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=msg)
    
    res = {"success": True, "message": msg}
    if dev_otp:
        res["test_mode_otp"] = dev_otp
    return res

@router.post("/otp/verify")
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    """
    Validates OTP for phone number confirmation.
    """
    success, msg = OtpService.verify_otp(db, payload.phone, payload.otp)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)
    return {"success": True, "message": msg}

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Resets password after verifying SMS OTP.
    """
    # 1. Verify OTP first
    success, msg = OtpService.verify_otp(db, payload.phone, payload.otp)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    user = db.query(User).filter(User.phone == payload.phone).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    # 2. Hash and update password
    user.password_hash = hash_password(payload.new_password)
    # Revoke all existing refresh tokens for security
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id).update({"revoked": True})
    db.commit()

    return {"success": True, "message": "Password reset successfully. Please log in with your new password."}

# ----------------- Admin User Management -----------------

@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    payload: UserStatusUpdateRequest,
    current_admin: User = Depends(require_roles([UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Admin-only endpoint to activate or deactivate worker accounts.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.is_active = payload.is_active
    if not payload.is_active:
        # Revoke all refresh tokens on deactivation
        db.query(RefreshToken).filter(RefreshToken.user_id == user.id).update({"revoked": True})
    
    db.commit()
    return {"success": True, "user_id": user.id, "is_active": user.is_active}
