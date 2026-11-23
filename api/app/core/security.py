import hashlib
import secrets
from passlib.context import CryptContext

# CryptContext configured with Argon2 and PBKDF2 fallback
pwd_context = CryptContext(schemes=["argon2", "pbkdf2_sha256"], deprecated="auto")

# 30-character unambiguous alphabet (omits 0, O, 1, I, L, 8, B to prevent confusion)
UNAMBIGUOUS_ALPHABET = "2345679ACDEFGHJKMNPQRSTUVWXYZ"


def generate_pairing_code(length: int = 8) -> str:
    """Generates an unambiguous 8-character pairing code."""
    return "".join(secrets.choice(UNAMBIGUOUS_ALPHABET) for _ in range(length))


def hash_pairing_code(code: str) -> str:
    """Computes a SHA-256 hash of the pairing code for database storage/lookup."""
    return hashlib.sha256(code.strip().upper().encode("utf-8")).hexdigest()


def generate_device_token() -> str:
    """Generates a high-entropy secret token for a paired kid device."""
    return secrets.token_urlsafe(48)


def hash_device_token(token: str) -> str:
    """Hashes the device token for safe database verification."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def hash_parent_pin(pin: str) -> str:
    """Hashes a 4-digit Parent PIN using Argon2."""
    if len(pin) != 4 or not pin.isdigit():
        raise ValueError("Parent PIN must be exactly 4 digits.")
    return pwd_context.hash(pin)


def verify_parent_pin(plain_pin: str, hashed_pin: str) -> bool:
    """Verifies a plain 4-digit Parent PIN against its stored Argon2 hash."""
    return pwd_context.verify(plain_pin, hashed_pin)
