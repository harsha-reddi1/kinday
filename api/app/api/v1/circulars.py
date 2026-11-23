from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.services.gemini_extractor import GeminiCircularExtractor
from app.schemas.circular import CircularExtractionResponse

router = APIRouter(prefix="/circulars", tags=["Circulars"])
extractor = GeminiCircularExtractor()


@router.post("/extract", response_model=CircularExtractionResponse)
async def extract_circular_events(
    file: UploadFile = File(...),
    family_timezone: str = Form("UTC"),
):
    """Parent endpoint to upload a school circular (PDF, PNG, JPEG, WebP)
    and receive structured events parsed via Gemini multimodal AI.
    """
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF or an image (JPEG, PNG, WebP).",
        )

    file_bytes = await file.read()

    try:
        extraction_result = await extractor.extract_events(
            file_bytes=file_bytes,
            mime_type=file.content_type,
            family_timezone=family_timezone,
        )
        return extraction_result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Circular extraction failed: {str(e)}",
        )
