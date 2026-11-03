import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.session import SessionLocal
from backend.app.db.init_db import init_db, SEED_PASSWORDS
from backend.app.models.user import User, UserRole, OtpVerification, normalize_phone
from backend.app.security.password import verify_password

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup_db():
    init_db()

def test_user_seed_accounts_exist():
    """Verify standard seeded accounts are initialized with Argon2id hashes."""
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.phone == "+919999900001").first()
        assert admin is not None
        assert admin.role == UserRole.ADMIN
        assert verify_password(SEED_PASSWORDS["admin"], admin.password_hash)

        anm = db.query(User).filter(User.phone == "+919422018834").first()
        assert anm is not None
        assert anm.role == UserRole.ANM
        assert verify_password(SEED_PASSWORDS["anm"], anm.password_hash)

        asha = db.query(User).filter(User.phone == "+919881099401").first()
        assert asha is not None
        assert asha.role == UserRole.ASHA
        assert verify_password(SEED_PASSWORDS["asha1"], asha.password_hash)
    finally:
        db.close()

def test_login_success_and_jwt_issuance():
    """Test successful login with phone and password returning JWT access and refresh tokens."""
    res = client.post("/api/v1/auth/login", json={
        "phone": "+91 98810 99401",
        "password": SEED_PASSWORDS["asha1"]
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["phone"] == "+919881099401"
    assert data["user"]["role"].lower() == "asha"

def test_login_invalid_password():
    """Test login failure on invalid credentials."""
    res = client.post("/api/v1/auth/login", json={
        "phone": "+91 98810 99401",
        "password": "WrongPassword!99"
    })
    assert res.status_code == 401
    assert "invalid" in res.json()["detail"].lower()

def test_get_current_user_profile():
    """Test authenticated profile retrieval using Bearer token."""
    login_res = client.post("/api/v1/auth/login", json={
        "phone": "+91 98810 99401",
        "password": SEED_PASSWORDS["asha1"]
    })
    token = login_res.json()["access_token"]

    me_res = client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert me_res.status_code == 200
    profile = me_res.json()
    assert profile["phone"] == "+919881099401"
    assert profile["role"].lower() == "asha"
    assert "Rukmini" in profile["full_name"]

def test_unauthenticated_access_rejected():
    """Test accessing protected route without token yields 401."""
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401

def test_token_refresh_rotation():
    """Test that refresh token yields a new pair and revokes previous token."""
    login_res = client.post("/api/v1/auth/login", json={
        "phone": "+91 94220 18834",
        "password": SEED_PASSWORDS["anm"]
    })
    refresh_token = login_res.json()["refresh_token"]

    refresh_res = client.post("/api/v1/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert refresh_res.status_code == 200
    data = refresh_res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["refresh_token"] != refresh_token

    # Reusing the old refresh token must be rejected
    reuse_res = client.post("/api/v1/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert reuse_res.status_code == 401

def test_token_revocation_on_logout():
    """Test logout revokes the refresh token."""
    login_res = client.post("/api/v1/auth/login", json={
        "phone": "+91 94220 18834",
        "password": SEED_PASSWORDS["anm"]
    })
    refresh_token = login_res.json()["refresh_token"]
    access_token = login_res.json()["access_token"]

    logout_res = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"},
        json={"refresh_token": refresh_token}
    )
    assert logout_res.status_code == 200

    # Refresh after logout must fail
    refresh_after = client.post("/api/v1/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert refresh_after.status_code == 401

def test_role_based_access_control():
    """Test RBAC: ASHA cannot execute admin-only endpoints."""
    # Login as ASHA
    asha_login = client.post("/api/v1/auth/login", json={
        "phone": "+91 98810 99401",
        "password": SEED_PASSWORDS["asha1"]
    })
    asha_token = asha_login.json()["access_token"]

    # Try to modify user status as ASHA -> must be 403 Forbidden
    forbidden_res = client.patch(
        "/api/v1/auth/users/ASHA-PUN-104/status",
        headers={"Authorization": f"Bearer {asha_token}"},
        json={"is_active": False}
    )
    assert forbidden_res.status_code == 403

    # Login as ADMIN
    admin_login = client.post("/api/v1/auth/login", json={
        "phone": "+91 99999 00001",
        "password": SEED_PASSWORDS["admin"]
    })
    admin_token = admin_login.json()["access_token"]

    # Admin modifies user status -> 200 OK
    admin_res = client.patch(
        "/api/v1/auth/users/ASHA-PUN-104/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"is_active": True}
    )
    assert admin_res.status_code == 200
    assert admin_res.json()["is_active"] is True

def test_otp_flow_and_rate_limiting():
    """Test OTP dispatch, verification attempt, and cooldown rate-limit."""
    test_phone = "+91 98810 99499"
    normalized = "+919881099499"

    # Reset any active cooldowns from previous test runs
    db = SessionLocal()
    try:
        db.query(OtpVerification).filter(OtpVerification.phone == normalized).delete()
        db.commit()
    finally:
        db.close()
    
    # 1. Send OTP
    send_res = client.post("/api/v1/auth/otp/send", json={"phone": test_phone})
    assert send_res.status_code == 200
    assert send_res.json()["success"] is True

    # 2. Immediate resend within 60s cooldown must trigger 429
    cooldown_res = client.post("/api/v1/auth/otp/send", json={"phone": test_phone})
    assert cooldown_res.status_code == 429
    assert "cooldown" in cooldown_res.json()["detail"].lower() or "wait" in cooldown_res.json()["detail"].lower()

    # 3. Retrieve generated OTP directly from DB for test verification
    db = SessionLocal()
    try:
        normalized = "+919881099499"
        otp_entry = db.query(OtpVerification).filter(
            OtpVerification.phone == normalized
        ).order_by(OtpVerification.created_at.desc()).first()
        assert otp_entry is not None
        # Hash is stored, plaintext is not in DB
        assert len(otp_entry.otp_hash) == 64  # SHA-256 length
    finally:
        db.close()

    # 4. Attempt verification with wrong OTP
    wrong_res = client.post("/api/v1/auth/otp/verify", json={
        "phone": test_phone,
        "otp": "000000"
    })
    assert wrong_res.status_code == 400
    assert "invalid" in wrong_res.json()["detail"].lower()

def test_user_registration():
    """Test new user registration with Argon2id password hash."""
    new_phone = "+91 98765 43210"
    # Ensure fresh state for test
    db = SessionLocal()
    try:
        clean_p = normalize_phone(new_phone)
        db.query(User).filter(User.phone == clean_p).delete()
        db.commit()
    finally:
        db.close()

    reg_res = client.post("/api/v1/auth/register", json={
        "phone": new_phone,
        "full_name": "Kavita Ramesh Patil",
        "full_name_mr": "कविता रमेश पाटील",
        "password": "Password@123",
        "role": "ASHA",
        "district": "Pune",
        "phc": "Uruli Kanchan PHC",
        "sub_center": "Koregaon Mul SC"
    })
    assert reg_res.status_code == 201
    user = reg_res.json()
    assert user["phone"] == "+919876543210"
    assert user["full_name"] == "Kavita Ramesh Patil"

    # Verify we can now login with this new account
    login_res = client.post("/api/v1/auth/login", json={
        "phone": new_phone,
        "password": "Password@123"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()
