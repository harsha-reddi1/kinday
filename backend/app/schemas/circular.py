from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class ExtractedEvent(BaseModel):
    title: str = Field(description="Clear title of the event or deadline.")
    date_start: Optional[str] = Field(None, description="Start date in YYYY-MM-DD format. Leave empty if ambiguous.")
    date_end: Optional[str] = Field(None, description="End date in YYYY-MM-DD format if multi-day.")
    time_start: Optional[str] = Field(None, description="Start time in 24-hr HH:MM format (e.g. 09:30). Leave empty if all-day or missing.")
    time_end: Optional[str] = Field(None, description="End time in 24-hr HH:MM format if specified.")
    is_all_day: bool = Field(False, description="True if this is an all-day event or deadline without a specific hour.")
    kind: Literal["school", "homework", "fee", "activity", "other"] = Field("school", description="Category of the event.")
    child_hint: Optional[str] = Field(None, description="Class/grade or child mention extracted from the circular (e.g. 'Grade 2', 'Kindergarten').")
    flagged_ambiguities: List[str] = Field(default_factory=list, description="Any missing or ambiguous information that the parent must verify.")
    confidence: float = Field(1.0, ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0.")


class CircularExtractionResponse(BaseModel):
    school_name: Optional[str] = Field(None, description="Detected school or organization name.")
    summary: str = Field(description="Brief 1-line overview of the circular.")
    events: List[ExtractedEvent] = Field(default_factory=list, description="List of events extracted from the document.")
    total_events: int = 0
    requires_manual_check: bool = True
