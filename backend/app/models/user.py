import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
import enum

from backend.app.db.session import Base

import re

class UserRole(str, enum.Enum):
    ASHA = "ASHA"
    ANM = "ANM"
    ADMIN = "ADMIN"

    @classmethod
    def _missing_(cls, value):
        for member in cls:
            if member.value.lower() == str(value).lower():
                return member
        return None

def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    cleaned = re.sub(r"[^\d+]", "", phone.strip())
    if not cleaned.startswith("+"):
        if len(cleaned) == 10:
            cleaned = "+91" + cleaned
        elif cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = "+" + cleaned
    return cleaned

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=lambda: f"USR-{uuid.uuid4().hex[:8].upper()}")
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=True)
    full_name = Column(String(100), nullable=False)
    full_name_mr = Column(String(100), nullable=True)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.ASHA)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Area & Facility hierarchy (Maharashtra Circles)
    district = Column(String(50), default="Pune")
    phc = Column(String(100), default="Khed Shivapur Primary Health Center")
    sub_center = Column(String(100), default="Khed Shivapur Sub-Center")
    village = Column(String(100), default="Khed Shivapur")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(50), primary_key=True, default=lambda: f"RT-{uuid.uuid4().hex[:8].upper()}")
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    jti = Column(String(50), nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="refresh_tokens")

class OtpVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String(50), primary_key=True, default=lambda: f"OTP-{uuid.uuid4().hex[:8].upper()}")
    phone = Column(String(20), index=True, nullable=False)
    otp_hash = Column(String(128), nullable=False)
    attempts = Column(Integer, default=0, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
