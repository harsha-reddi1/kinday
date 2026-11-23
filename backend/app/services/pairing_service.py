import datetime
from typing import Optional
from supabase import create_client, Client

from app.core.config import settings
from app.core.security import (
    generate_pairing_code,
    hash_pairing_code,
    generate_device_token,
    hash_device_token,
    hash_parent_pin,
    verify_parent_pin,
)
from app.schemas.pairing import RedeemPairingCodeResponse


class PairingService:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY,
        )

    def create_pairing_code(self, child_id: str) -> str:
        """Generates and stores an 8-character single-use pairing code valid for 10 minutes."""
        code = generate_pairing_code()
        code_hash = hash_pairing_code(code)
        expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
            minutes=settings.PAIRING_CODE_TTL_MINUTES
        )

        # Invalidate any existing unused codes for this child
        self.supabase.table("kd_pairing_codes").update({"is_used": True}).eq("child_id", child_id).eq("is_used", False).execute()

        # Insert new code
        self.supabase.table("kd_pairing_codes").insert({
            "child_id": child_id,
            "code_hash": code_hash,
            "expires_at": expires_at.isoformat(),
            "is_used": False,
        }).execute()

        return code

    def redeem_pairing_code(self, code: str, device_name: str) -> RedeemPairingCodeResponse:
        """Validates the pairing code and issues a secure device token."""
        code_hash = hash_pairing_code(code)
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Lookup unused, non-expired code
        response = (
            self.supabase.table("kd_pairing_codes")
            .select("id, child_id, expires_at, is_used, kd_children(nickname, avatar_preset)")
            .eq("code_hash", code_hash)
            .eq("is_used", False)
            .gt("expires_at", now_iso)
            .limit(1)
            .execute()
        )

        if not response.data:
            raise ValueError("Invalid or expired pairing code. Please generate a new code in the Parent app.")

        record = response.data[0]
        child_id = record["child_id"]
        child_data = record["kd_children"]

        # Mark code as used immediately
        self.supabase.table("kd_pairing_codes").update({"is_used": True}).eq("id", record["id"]).execute()

        # Generate device token
        device_token = generate_device_token()
        token_hash = hash_device_token(device_token)

        # Register kid device
        self.supabase.table("kd_kid_devices").insert({
            "child_id": child_id,
            "device_token_hash": token_hash,
            "device_name": device_name,
            "is_revoked": False,
        }).execute()

        return RedeemPairingCodeResponse(
            device_token=device_token,
            child_id=child_id,
            child_nickname=child_data["nickname"],
            child_avatar_preset=child_data["avatar_preset"],
        )

    def set_parent_pin(self, user_id: str, family_id: str, pin: str):
        """Sets the hashed 4-digit Parent PIN for exiting Kids Zone on shared devices."""
        pin_hash = hash_parent_pin(pin)
        self.supabase.table("kd_family_members").update({
            "parent_pin_hash": pin_hash
        }).eq("user_id", user_id).eq("family_id", family_id).execute()

    def verify_parent_pin(self, user_id: str, family_id: str, pin: str) -> bool:
        """Verifies the entered 4-digit Parent PIN."""
        res = (
            self.supabase.table("kd_family_members")
            .select("parent_pin_hash")
            .eq("user_id", user_id)
            .eq("family_id", family_id)
            .limit(1)
            .execute()
        )
        if not res.data or not res.data[0].get("parent_pin_hash"):
            return False
        return verify_parent_pin(pin, res.data[0]["parent_pin_hash"])
