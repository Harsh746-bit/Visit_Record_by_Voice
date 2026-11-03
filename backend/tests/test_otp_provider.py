import pytest
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.session import SessionLocal
from backend.app.models.user import OtpVerification, normalize_phone
from backend.app.services.sms.base import OtpService, get_sms_provider, Msg91Provider, ConsoleSmsProvider
from backend.app.core.config import settings

client = TestClient(app)

def test_task2_otp_generation_and_hash_storage():
    """Verify OTP generation stores SHA-256 hash in PostgreSQL and never stores plaintext."""
    test_phone = "+91 98810 55441"
    norm = normalize_phone(test_phone)

    db = SessionLocal()
    try:
        db.query(OtpVerification).filter(OtpVerification.phone == norm).delete()
        db.commit()

        success, msg, dev_otp = OtpService.request_otp(db, test_phone)
        assert success is True
        assert dev_otp is not None
        assert len(dev_otp) == 6
        assert dev_otp.isdigit()

        # Check DB record
        record = db.query(OtpVerification).filter(OtpVerification.phone == norm).first()
        assert record is not None
        assert record.otp_hash == OtpService.hash_otp(dev_otp)
        assert dev_otp not in record.otp_hash  # Hash is one-way SHA-256
        assert record.is_used is False
        assert record.attempts == 0
    finally:
        db.close()

def test_task2_incorrect_otp_and_attempt_limits():
    """Verify incorrect OTP decrements attempts and locks after 3 tries."""
    test_phone = "+91 98810 55442"
    norm = normalize_phone(test_phone)

    db = SessionLocal()
    try:
        db.query(OtpVerification).filter(OtpVerification.phone == norm).delete()
        db.commit()

        success, msg, real_otp = OtpService.request_otp(db, test_phone)
        assert success is True

        # Attempt 1: Wrong OTP
        v1_ok, v1_msg = OtpService.verify_otp(db, test_phone, "000000")
        assert v1_ok is False
        assert "2 attempt(s) remaining" in v1_msg

        # Attempt 2: Wrong OTP
        v2_ok, v2_msg = OtpService.verify_otp(db, test_phone, "111111")
        assert v2_ok is False
        assert "1 attempt(s) remaining" in v2_msg

        # Attempt 3: Wrong OTP -> should lock
        v3_ok, v3_msg = OtpService.verify_otp(db, test_phone, "222222")
        assert v3_ok is False

        # Attempt 4: Even with correct OTP, locked record must be rejected
        v4_ok, v4_msg = OtpService.verify_otp(db, test_phone, real_otp)
        assert v4_ok is False
        assert "exceeded" in v4_msg.lower() or "expired" in v4_msg.lower()
    finally:
        db.close()

def test_task2_otp_expiration():
    """Verify expired OTP is rejected."""
    test_phone = "+91 98810 55443"
    norm = normalize_phone(test_phone)

    db = SessionLocal()
    try:
        db.query(OtpVerification).filter(OtpVerification.phone == norm).delete()
        db.commit()

        success, msg, real_otp = OtpService.request_otp(db, test_phone)
        assert success is True

        # Artificially expire the record by backdating expires_at
        rec = db.query(OtpVerification).filter(OtpVerification.phone == norm).first()
        rec.expires_at = datetime.now(timezone.utc) - timedelta(minutes=10)
        db.commit()

        # Verification must fail due to expiry
        v_ok, v_msg = OtpService.verify_otp(db, test_phone, real_otp)
        assert v_ok is False
        assert "expired" in v_msg.lower()
    finally:
        db.close()

def test_task2_otp_reuse_prevention():
    """Verify verified OTP cannot be reused."""
    test_phone = "+91 98810 55444"
    norm = normalize_phone(test_phone)

    db = SessionLocal()
    try:
        db.query(OtpVerification).filter(OtpVerification.phone == norm).delete()
        db.commit()

        success, msg, real_otp = OtpService.request_otp(db, test_phone)
        assert success is True

        # First verification succeeds
        v1_ok, v1_msg = OtpService.verify_otp(db, test_phone, real_otp)
        assert v1_ok is True

        # Second verification with same OTP must fail
        v2_ok, v2_msg = OtpService.verify_otp(db, test_phone, real_otp)
        assert v2_ok is False
        assert "expired or does not exist" in v2_msg.lower()
    finally:
        db.close()

def test_task2_resend_cooldown_rate_limit():
    """Verify requesting OTP within 60 seconds returns cooldown warning / 429."""
    test_phone = "+91 98810 55445"
    norm = normalize_phone(test_phone)

    db = SessionLocal()
    try:
        db.query(OtpVerification).filter(OtpVerification.phone == norm).delete()
        db.commit()

        # First request succeeds
        res1 = client.post("/api/v1/auth/otp/send", json={"phone": test_phone})
        assert res1.status_code == 200

        # Immediate second request triggers 429 cooldown
        res2 = client.post("/api/v1/auth/otp/send", json={"phone": test_phone})
        assert res2.status_code == 429
        assert "wait" in res2.json()["detail"].lower()
    finally:
        db.close()

def test_task2_production_sms_mode_guards():
    """Verify that in production mode, missing MSG91 credentials strictly raise an error rather than faking delivery."""
    import os
    original_env = settings.ENVIRONMENT
    original_os_key = os.environ.get("MSG91_AUTH_KEY")
    original_os_tpl = os.environ.get("MSG91_OTP_TEMPLATE_ID")
    try:
        settings.ENVIRONMENT = "production"
        settings.MSG91_AUTH_KEY = ""
        settings.MSG91_OTP_TEMPLATE_ID = ""
        if "MSG91_AUTH_KEY" in os.environ:
            del os.environ["MSG91_AUTH_KEY"]
        if "MSG91_OTP_TEMPLATE_ID" in os.environ:
            del os.environ["MSG91_OTP_TEMPLATE_ID"]

        with pytest.raises(RuntimeError) as exc_info:
            get_sms_provider()

        err_msg = str(exc_info.value)
        assert "MSG91_AUTH_KEY" in err_msg
        assert "MSG91_OTP_TEMPLATE_ID" in err_msg
    finally:
        settings.ENVIRONMENT = original_env
        if original_os_key:
            os.environ["MSG91_AUTH_KEY"] = original_os_key
        if original_os_tpl:
            os.environ["MSG91_OTP_TEMPLATE_ID"] = original_os_tpl
