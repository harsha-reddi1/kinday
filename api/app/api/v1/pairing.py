from fastapi import APIRouter, HTTPException, status
from app.services.pairing_service import PairingService
from app.schemas.pairing import (
    CreatePairingCodeRequest,
    CreatePairingCodeResponse,
    RedeemPairingCodeRequest,
    RedeemPairingCodeResponse,
    SetParentPinRequest,
    VerifyParentPinRequest,
    PinVerificationResponse,
)

router = APIRouter(prefix="/pairing", tags=["Pairing & Security"])
pairing_service = PairingService()


@router.post("/generate", response_model=CreatePairingCodeResponse)
async def generate_code(req: CreatePairingCodeRequest):
    """Parent initiates device pairing for a child profile."""
    try:
        code = pairing_service.create_pairing_code(req.child_id)
        return CreatePairingCodeResponse(pairing_code=code, child_id=req.child_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not generate pairing code: {str(e)}",
        )


@router.post("/redeem", response_model=RedeemPairingCodeResponse)
async def redeem_code(req: RedeemPairingCodeRequest):
    """Kid companion device redeems 8-char code to acquire a device token."""
    try:
        result = pairing_service.redeem_pairing_code(req.pairing_code, req.device_name)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pairing redemption failed: {str(e)}",
        )


@router.post("/verify-pin", response_model=PinVerificationResponse)
async def verify_pin(user_id: str, family_id: str, req: VerifyParentPinRequest):
    """Verifies parent 4-digit PIN when exiting Kids Zone on shared devices."""
    valid = pairing_service.verify_parent_pin(user_id, family_id, req.pin)
    return PinVerificationResponse(valid=valid)
