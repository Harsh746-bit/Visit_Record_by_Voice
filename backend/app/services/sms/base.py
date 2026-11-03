import os
import random
import hashlib
import logging
from datetime import datetime, timedelta, timezone
from abc import ABC, abstractmethod
from typing import Optional, Tuple
from sqlalchemy.orm import Session
import requests

from backend.app.models.user import OtpVerification, normalize_phone
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class SmsProvider(ABC):
    @abstractmethod
    def send_otp(self, phone: str, otp: str) -> bool:
        """Sends OTP to the recipient's phone number."""
        pass

class Msg91Provider(SmsProvider):
    """
    Production SMS provider using MSG91 Indian SMS Gateway.
    """
    def __init__(self, auth_key: Optional[str] = None, template_id: Optional[str] = None):
        self.auth_key = auth_key or settings.MSG91_AUTH_KEY or os.getenv("MSG91_AUTH_KEY")
        self.template_id = template_id or settings.MSG91_OTP_TEMPLATE_ID or os.getenv("MSG91_OTP_TEMPLATE_ID")

    def send_otp(self, phone: str, otp: str) -> bool:
        if not self.auth_key or not self.template_id:
            raise RuntimeError(
                "MSG91 SMS credentials missing. Required environment variables: MSG91_AUTH_KEY and MSG91_OTP_TEMPLATE_ID."
            )
        try:
            url = f"https://control.msg91.com/api/v5/otp?template_id={self.template_id}&mobile={phone}&authkey={self.auth_key}&otp={otp}"
            res = requests.post(url, timeout=10)
            if res.status_code == 200 and res.json().get("type") == "success":
                logger.info(f"OTP successfully dispatched via MSG91 to {phone[:6]}***")
                return True
            else:
                logger.error(f"MSG91 delivery error: {res.text}")
                raise RuntimeError(f"MSG91 delivery failed: {res.text}")
        except Exception as e:
            logger.error(f"Failed to send SMS via MSG91: {e}")
            raise e

class ConsoleSmsProvider(SmsProvider):
    """Development / test SMS provider. Strictly disallowed in production mode."""
    def send_otp(self, phone: str, otp: str) -> bool:
        logger.info(f"[SMS CONSOLE SIMULATOR] Dispatched OTP to {phone} (Test Mode)")
        return True

def get_sms_provider() -> SmsProvider:
    auth_key = settings.MSG91_AUTH_KEY or os.getenv("MSG91_AUTH_KEY", "")
    template_id = settings.MSG91_OTP_TEMPLATE_ID or os.getenv("MSG91_OTP_TEMPLATE_ID", "")
    is_valid_msg91 = bool(auth_key and template_id and template_id != "your_template_id")

    if settings.ENVIRONMENT == "production":
        # In production mode, Console provider is strictly forbidden
        if not is_valid_msg91:
            raise RuntimeError(
                "Production SMS delivery is not configured. Required environment variables: "
                "MSG91_AUTH_KEY and MSG91_OTP_TEMPLATE_ID."
            )
        return Msg91Provider(auth_key, template_id)
        
    # Development mode: prefer MSG91 if configured, fallback to Console
    if settings.SMS_PROVIDER == "msg91" and is_valid_msg91:
        return Msg91Provider(auth_key, template_id)
    return ConsoleSmsProvider()

class OtpService:
    EXPIRY_MINUTES = 5
    MAX_ATTEMPTS = 3
    RESEND_COOLDOWN_SECONDS = 60

    @staticmethod
    def hash_otp(otp: str) -> str:
        return hashlib.sha256(otp.encode("utf-8")).hexdigest()

    @classmethod
    def request_otp(cls, db: Session, phone: str) -> Tuple[bool, str, Optional[str]]:
        """
        Generates and securely stores OTP with cooldown and rate-limit enforcement.
        Returns: (success, message, dev_otp_if_console_mode)
        """
        phone = normalize_phone(phone)
        now = datetime.now(timezone.utc)
        
        # Check cooldown
        recent = (
            db.query(OtpVerification)
            .filter(OtpVerification.phone == phone, OtpVerification.is_used == False)
            .order_by(OtpVerification.created_at.desc())
            .first()
        )
        if recent:
            elapsed = (now - recent.created_at.replace(tzinfo=timezone.utc)).total_seconds()
            if elapsed < cls.RESEND_COOLDOWN_SECONDS:
                wait_left = int(cls.RESEND_COOLDOWN_SECONDS - elapsed)
                return False, f"Please wait {wait_left}s before requesting a new OTP.", None

        # Generate secure random 6-digit OTP
        otp_plain = f"{random.randint(100000, 999999)}"
        otp_hash = cls.hash_otp(otp_plain)
        expires_at = now + timedelta(minutes=cls.EXPIRY_MINUTES)

        record = OtpVerification(
            phone=phone,
            otp_hash=otp_hash,
            attempts=0,
            expires_at=expires_at,
            is_used=False
        )
        db.add(record)
        db.commit()

        # Send via configured provider
        provider = get_sms_provider()
        dev_otp = otp_plain if (isinstance(provider, ConsoleSmsProvider) or settings.ENVIRONMENT != "production") else None
        try:
            provider.send_otp(phone, otp_plain)
            return True, "OTP sent successfully.", dev_otp
        except RuntimeError as e:
            return False, str(e), None

    @classmethod
    def verify_otp(cls, db: Session, phone: str, plain_otp: str) -> Tuple[bool, str]:
        """
        Verifies plaintext OTP against stored hash, enforcing max attempts and expiry.
        """
        phone = normalize_phone(phone)
        now = datetime.now(timezone.utc)
        record = (
            db.query(OtpVerification)
            .filter(
                OtpVerification.phone == phone,
                OtpVerification.is_used == False,
                OtpVerification.expires_at > now
            )
            .order_by(OtpVerification.created_at.desc())
            .first()
        )

        if not record:
            return False, "OTP has expired or does not exist. Please request a new one."

        if record.attempts >= cls.MAX_ATTEMPTS:
            record.is_used = True
            db.commit()
            return False, "Maximum verification attempts exceeded. Please request a new OTP."

        record.attempts += 1
        provided_hash = cls.hash_otp(plain_otp)

        if provided_hash != record.otp_hash:
            db.commit()
            remaining = cls.MAX_ATTEMPTS - record.attempts
            return False, f"Invalid OTP. {remaining} attempt(s) remaining."

        # Mark consumed
        record.is_used = True
        db.commit()
        return True, "Phone number verified successfully."
