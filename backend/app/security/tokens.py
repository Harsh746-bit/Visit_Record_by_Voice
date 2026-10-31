import os
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, Tuple
import jwt
from jwt.exceptions import PyJWTError, ExpiredSignatureError

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-visit-record-voice-hackathon-2026-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours for frontline ASHA shifts
REFRESH_TOKEN_EXPIRE_DAYS = 30

def create_access_token(
    user_id: str,
    role: str,
    phone: str,
    expires_delta: Optional[timedelta] = None
) -> Tuple[str, str, datetime]:
    """
    Creates a signed JWT access token.
    Returns: (token_str, jti, expires_at)
    """
    now = datetime.now(timezone.utc)
    expires_at = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    jti = str(uuid.uuid4())
    
    payload = {
        "sub": user_id,
        "role": role.upper(),
        "phone": phone,
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "type": "access"
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expires_at

def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a JWT access token.
    Raises ExpiredSignatureError or PyJWTError on failure.
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

def generate_refresh_token() -> Tuple[str, str, datetime]:
    """
    Generates a secure cryptographically random refresh token string and its SHA-256 hash.
    Returns: (plain_token, token_hash, expires_at)
    """
    plain_token = secrets.token_urlsafe(64)
    token_hash = hash_token(plain_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return plain_token, token_hash, expires_at

def hash_token(token: str) -> str:
    """Computes SHA-256 hash of a token for secure storage."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
