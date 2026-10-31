from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

class ExtractionStatus(str, Enum):
    EXTRACTED = "extracted"
    MISSING = "missing"
    AMBIGUOUS = "ambiguous"
    REQUIRES_VERIFICATION = "requires_verification"
    CONCERNING = "concerning"

class ValidationSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class EvidenceSpan(BaseModel):
    field_name: str
    extracted_value: Any
    start_char: int
    end_char: int
    source_text: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    status: ExtractionStatus = ExtractionStatus.EXTRACTED
    reasoning: Optional[str] = None

class ExtractedField(BaseModel):
    value: Optional[Any] = None
    unit: Optional[str] = None
    supporting_phrase: Optional[str] = None
    char_range: Optional[List[int]] = None # [start, end]
    status: ExtractionStatus = ExtractionStatus.MISSING
    confidence: Optional[float] = None
    is_verified: bool = False
    edited_by_user: bool = False

class VisitMeasurements(BaseModel):
    blood_pressure_systolic: ExtractedField = Field(default_factory=ExtractedField)
    blood_pressure_diastolic: ExtractedField = Field(default_factory=ExtractedField)
    weight_kg: ExtractedField = Field(default_factory=ExtractedField)
    hemoglobin_g_dl: ExtractedField = Field(default_factory=ExtractedField)
    blood_sugar_mg_dl: ExtractedField = Field(default_factory=ExtractedField)
    fetal_heart_rate_bpm: ExtractedField = Field(default_factory=ExtractedField)
    fundal_height_cm: ExtractedField = Field(default_factory=ExtractedField)

class PregnancyDetails(BaseModel):
    gestational_age_weeks: ExtractedField = Field(default_factory=ExtractedField)
    trimester: ExtractedField = Field(default_factory=ExtractedField)
    gravida: ExtractedField = Field(default_factory=ExtractedField)
    parity: ExtractedField = Field(default_factory=ExtractedField)
    expected_delivery_date: ExtractedField = Field(default_factory=ExtractedField)
    high_risk_pregnancy: ExtractedField = Field(default_factory=ExtractedField)

class SymptomsObservations(BaseModel):
    fever: ExtractedField = Field(default_factory=ExtractedField)
    headache_or_blurred_vision: ExtractedField = Field(default_factory=ExtractedField)
    swelling_pedal_edema: ExtractedField = Field(default_factory=ExtractedField)
    abdominal_pain: ExtractedField = Field(default_factory=ExtractedField)
    bleeding_or_spotting: ExtractedField = Field(default_factory=ExtractedField)
    fetal_movement_normal: ExtractedField = Field(default_factory=ExtractedField)
    nausea_or_vomiting: ExtractedField = Field(default_factory=ExtractedField)
    general_notes: ExtractedField = Field(default_factory=ExtractedField)

class InterventionsProvided(BaseModel):
    ifa_tablets_given: ExtractedField = Field(default_factory=ExtractedField)
    calcium_tablets_given: ExtractedField = Field(default_factory=ExtractedField)
    tt_or_td_injection_status: ExtractedField = Field(default_factory=ExtractedField)
    counseling_topics: ExtractedField = Field(default_factory=ExtractedField)
    next_checkup_date: ExtractedField = Field(default_factory=ExtractedField)
    referral_recommended: ExtractedField = Field(default_factory=ExtractedField)
    referral_facility: ExtractedField = Field(default_factory=ExtractedField)

class StructuredVisitRecord(BaseModel):
    record_id: Optional[str] = None
    beneficiary_id: str
    beneficiary_name: str
    asha_id: str
    asha_name: str
    language: str  # "mr-IN" or "hi-IN"
    transcript: str
    audio_duration_seconds: float = 0.0
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
    
    measurements: VisitMeasurements = Field(default_factory=VisitMeasurements)
    pregnancy_details: PregnancyDetails = Field(default_factory=PregnancyDetails)
    symptoms: SymptomsObservations = Field(default_factory=SymptomsObservations)
    interventions: InterventionsProvided = Field(default_factory=InterventionsProvided)
    
    evidence_spans: List[EvidenceSpan] = Field(default_factory=list)
    validation_warnings: List[Dict[str, Any]] = Field(default_factory=list)
    
    is_confirmed_by_asha: bool = False
    confirmed_at: Optional[datetime] = None
    anm_review_status: str = "pending" # "pending", "reviewed", "returned"
    anm_review_notes: Optional[str] = None
