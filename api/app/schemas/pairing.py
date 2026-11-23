from typing import Optional
from pydantic import BaseModel, Field


class CreatePairingCodeRequest(BaseModel):
    child_id: str = Field(..., description="UUID of the child profile being paired.")


class CreatePairingCodeResponse(BaseModel):
    pairing_code: str = Field(..., description="8-character unambiguous code.")
    expires_in_seconds: int = Field(600, description="10 minutes until expiry.")
    child_id: str


class RedeemPairingCodeRequest(BaseModel):
    pairing_code: str = Field(..., min_length=8, max_length=8, description="8-character pairing code.")
    device_name: str = Field(..., description="Name/Model of the device (e.g., 'Samsung Galaxy Tab A9').")


class RedeemPairingCodeResponse(BaseModel):
    device_token: str = Field(..., description="Secret bearer token for the kid device.")
    child_id: str
    child_nickname: str
    child_avatar_preset: str


class SetParentPinRequest(BaseModel):
    pin: str = Field(..., min_length=4, max_length=4, pattern=r"^\d{4}$")


class VerifyParentPinRequest(BaseModel):
    pin: str = Field(..., min_length=4, max_length=4, pattern=r"^\d{4}$")


class PinVerificationResponse(BaseModel):
    valid: bool
