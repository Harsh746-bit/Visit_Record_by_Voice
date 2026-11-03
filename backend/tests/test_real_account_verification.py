import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.session import SessionLocal
from backend.app.db.init_db import init_db, SEED_PASSWORDS
from backend.app.models.user import User, UserRole, RefreshToken, normalize_phone
from backend.app.security.tokens import hash_token
from backend.app.security.password import verify_password

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup():
    init_db()

def test_task1_asha_registration_and_postgres_persistence():
    """Verify frontline ASHA registration persists in PostgreSQL with Argon2id hash."""
    test_phone = "+91 98220 99881"
    norm = normalize_phone(test_phone)
    db = SessionLocal()
    try:
        db.query(User).filter(User.phone == norm).delete()
        db.commit()
    finally:
        db.close()

    reg_res = client.post("/api/v1/auth/register", json={
        "phone": test_phone,
        "full_name": "Aarti Dilip Pawar",
        "full_name_mr": "आरती दिलीप पवार",
        "password": "Aarti#Secure_2026",
        "role": "ASHA",
        "district": "Pune",
        "phc": "Khed Shivapur Primary Health Center",
        "sub_center": "Shivapur Sub-Center",
        "village": "Shivapur"
    })
    assert reg_res.status_code == 201

    # Verify directly in PostgreSQL
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == normalize_phone(test_phone)).first()
        assert user is not None
        assert user.role == UserRole.ASHA
        assert user.full_name == "Aarti Dilip Pawar"
        assert verify_password("Aarti#Secure_2026", user.password_hash)
        assert user.is_active is True
    finally:
        db.close()

def test_task1_anm_registration_and_postgres_persistence():
    """Verify supervisor ANM registration persists in PostgreSQL with Argon2id hash."""
    test_phone = "+91 94220 33445"
    reg_res = client.post("/api/v1/auth/register", json={
        "phone": test_phone,
        "full_name": "Manisha Sanjay Kulkarni",
        "full_name_mr": "मनीषा संजय कुलकर्णी",
        "password": "Manisha#Anm_2026",
        "role": "ANM",
        "district": "Pune",
        "phc": "Saswad Rural Hospital",
        "sub_center": "Saswad Circle",
        "village": "Saswad"
    })
    assert reg_res.status_code in [201, 400]

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == normalize_phone(test_phone)).first()
        assert user is not None
        assert user.role == UserRole.ANM
        assert verify_password("Manisha#Anm_2026", user.password_hash)
    finally:
        db.close()

def test_task1_password_validation():
    """Verify password rules and failure on incorrect password."""
    # Attempt login with wrong password
    res = client.post("/api/v1/auth/login", json={
        "phone": "+91 94220 33445",
        "password": "WrongPassword!99"
    })
    assert res.status_code == 401
    assert "invalid" in res.json()["detail"].lower()

    # Attempt registration with too-short password (< 6 chars)
    short_res = client.post("/api/v1/auth/register", json={
        "phone": "+91 98000 11111",
        "full_name": "Test Short",
        "password": "123",
        "role": "ASHA"
    })
    assert short_res.status_code == 422

def test_task1_login_logout_and_session_invalidation():
    """Verify login issues valid tokens and logout invalidates the session without creating fake auth."""
    # 1. Login
    login_res = client.post("/api/v1/auth/login", json={
        "phone": "+91 94220 33445",
        "password": "Manisha#Anm_2026"
    })
    assert login_res.status_code == 200
    tokens = login_res.json()
    access_token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]

    # 2. Access protected endpoint
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {access_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["phone"] == "+919422033445"

    # 3. Logout
    logout_res = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"},
        json={"refresh_token": refresh_token}
    )
    assert logout_res.status_code == 200

    # 4. Verify refresh token is revoked in PostgreSQL
    db = SessionLocal()
    try:
        rt_entry = db.query(RefreshToken).filter(RefreshToken.token_hash == hash_token(refresh_token)).first()
        assert rt_entry is not None
        assert rt_entry.revoked is True
    finally:
        db.close()

    # 5. Refreshing with revoked token must fail
    refresh_fail = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_fail.status_code == 401

def test_task1_account_deactivation_and_reactivation_by_admin():
    """Verify admin can deactivate a worker account, blocking login, and reactivate it."""
    # 1. Login as Admin
    admin_login = client.post("/api/v1/auth/login", json={
        "phone": "+91 99999 00001",
        "password": SEED_PASSWORDS["admin"]
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]

    db = SessionLocal()
    target_user = db.query(User).filter(User.phone == "+919822011223").first()
    assert target_user is not None
    user_id = target_user.id
    db.close()

    # 2. Admin deactivates ASHA user
    deact_res = client.patch(
        f"/api/v1/auth/users/{user_id}/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"is_active": False}
    )
    assert deact_res.status_code == 200
    assert deact_res.json()["is_active"] is False

    # 3. Deactivated user attempting to login must fail
    login_attempt = client.post("/api/v1/auth/login", json={
        "phone": "+91 98220 11223",
        "password": "Aarti#Secure_2026"
    })
    assert login_attempt.status_code in [400, 401, 403]
    assert "deactivated" in login_attempt.json()["detail"].lower() or "inactive" in login_attempt.json()["detail"].lower()

    # 4. Admin reactivates ASHA user
    react_res = client.patch(
        f"/api/v1/auth/users/{user_id}/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"is_active": True}
    )
    assert react_res.status_code == 200
    assert react_res.json()["is_active"] is True

    # 5. User can now login successfully
    login_success = client.post("/api/v1/auth/login", json={
        "phone": "+91 98220 11223",
        "password": "Aarti#Secure_2026"
    })
    assert login_success.status_code == 200
