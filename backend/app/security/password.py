from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
import logging

logger = logging.getLogger(__name__)

# Argon2id hasher configured per OWASP recommendations:
# time_cost=3, memory_cost=65536 (64 MB), parallelism=4
ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    salt_len=16
)

def hash_password(password: str) -> str:
    """Hashes a plaintext password using Argon2id."""
    if not password:
        raise ValueError("Password cannot be empty.")
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against an Argon2id hash."""
    if not plain_password or not hashed_password:
        return False
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False
    except Exception as e:
        logger.error(f"Argon2 verification unexpected error: {e}")
        return False

def check_needs_rehash(hashed_password: str) -> bool:
    """Checks if password hash parameters need upgrading."""
    try:
        return ph.check_needs_rehash(hashed_password)
    except Exception:
        return True
