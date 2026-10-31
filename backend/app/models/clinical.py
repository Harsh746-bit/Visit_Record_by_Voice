import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, Integer, Float, DateTime, 
    ForeignKey, Enum as SQLEnum, Text, JSON
)
from sqlalchemy.orm import relationship
import enum

from backend.app.db.session import Base

class VisitType(str, enum.Enum):
    ANC = "ANC"
    PNC = "PNC"
    IMMUNIZATION = "IMMUNIZATION"
    CHILD_NUTRITION = "CHILD_NUTRITION"
    ROUTINE_CHECKUP = "ROUTINE_CHECKUP"

class ReviewStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    RETURNED = "returned"

class Household(Base):
    __tablename__ = "households"

    id = Column(String(50), primary_key=True, default=lambda: f"HH-{uuid.uuid4().hex[:8].upper()}")
    village = Column(String(100), nullable=False)
    sub_center = Column(String(100), nullable=False)
    head_name = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=True)
    created_by = Column(String(50), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    beneficiaries = relationship("Beneficiary", back_populates="household")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(String(50), primary_key=True, default=lambda: f"BEN-{uuid.uuid4().hex[:8].upper()}")
    household_id = Column(String(50), ForeignKey("households.id"), nullable=True)
    rch_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    full_name_mr = Column(String(100), nullable=True)
    age = Column(Integer, nullable=False)
    category = Column(String(50), default="Pregnant Woman") # ANC, PNC, Infant
    gestational_weeks = Column(Integer, nullable=True)
    edd = Column(String(20), nullable=True)
    is_high_risk = Column(Boolean, default=False, nullable=False)
    high_risk_reasons = Column(Text, nullable=True)
    assigned_asha_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    village = Column(String(100), nullable=False)
    sub_center = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    household = relationship("Household", back_populates="beneficiaries")
    visits = relationship("Visit", back_populates="beneficiary", cascade="all, delete-orphan")

class Visit(Base):
    __tablename__ = "visits"

    id = Column(String(50), primary_key=True, default=lambda: f"VST-{uuid.uuid4().hex[:8].upper()}")
    beneficiary_id = Column(String(50), ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False, index=True)
    asha_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    visit_type = Column(SQLEnum(VisitType), default=VisitType.ANC, nullable=False)
    encounter_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    sync_status = Column(String(20), default="synced", nullable=False) # draft, pending_upload, synced
    idempotency_key = Column(String(64), unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    beneficiary = relationship("Beneficiary", back_populates="visits")
    record = relationship("VisitRecord", back_populates="visit", uselist=False, cascade="all, delete-orphan")

class VisitRecord(Base):
    __tablename__ = "visit_records"

    id = Column(String(50), primary_key=True, default=lambda: f"REC-2026-{uuid.uuid4().hex[:6].upper()}")
    visit_id = Column(String(50), ForeignKey("visits.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    language = Column(String(10), default="mr-IN", nullable=False)
    transcript = Column(Text, nullable=False)
    audio_url = Column(String(255), nullable=True)
    audio_duration_seconds = Column(Float, default=42.0)

    # Clinical Measurements
    bp_systolic = Column(Integer, nullable=True)
    bp_diastolic = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    hemoglobin_g_dl = Column(Float, nullable=True)
    gestational_weeks = Column(Integer, nullable=True)
    fundal_height_cm = Column(Float, nullable=True)

    # Symptoms & Observations
    headache = Column(Boolean, default=False)
    pedal_edema = Column(Boolean, default=False)
    fetal_movement_normal = Column(Boolean, default=True)
    fever = Column(Boolean, default=False)
    bleeding_or_spotting = Column(Boolean, default=False)

    # Interventions
    ifa_tablets_given = Column(Boolean, default=False)
    calcium_tablets_given = Column(Boolean, default=False)
    referral_recommended = Column(Boolean, default=False)
    referral_facility = Column(String(100), nullable=True)

    # Sign-off & Supervisory Workflow
    is_confirmed_by_asha = Column(Boolean, default=True, nullable=False)
    confirmed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    anm_review_status = Column(SQLEnum(ReviewStatus), default=ReviewStatus.PENDING, nullable=False, index=True)
    anm_review_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(String(50), ForeignKey("users.id"), nullable=True)

    visit = relationship("Visit", back_populates="record")
    evidence_spans = relationship("EvidenceSpan", back_populates="visit_record", cascade="all, delete-orphan")
    review_actions = relationship("ReviewAction", back_populates="visit_record", cascade="all, delete-orphan")
    corrections = relationship("Correction", back_populates="visit_record", cascade="all, delete-orphan")

class EvidenceSpan(Base):
    __tablename__ = "evidence_spans"

    id = Column(String(50), primary_key=True, default=lambda: f"EVD-{uuid.uuid4().hex[:8].upper()}")
    visit_record_id = Column(String(50), ForeignKey("visit_records.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(50), nullable=False)
    extracted_value = Column(String(100), nullable=False)
    start_char = Column(Integer, nullable=False)
    end_char = Column(Integer, nullable=False)
    source_text = Column(Text, nullable=False)
    confidence = Column(Float, default=0.98)
    status = Column(String(30), default="extracted")

    visit_record = relationship("VisitRecord", back_populates="evidence_spans")

class ReviewAction(Base):
    __tablename__ = "review_actions"

    id = Column(String(50), primary_key=True, default=lambda: f"ACT-{uuid.uuid4().hex[:8].upper()}")
    visit_record_id = Column(String(50), ForeignKey("visit_records.id", ondelete="CASCADE"), nullable=False, index=True)
    anm_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(20), nullable=False) # approved, returned
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    visit_record = relationship("VisitRecord", back_populates="review_actions")

class Correction(Base):
    __tablename__ = "corrections"

    id = Column(String(50), primary_key=True, default=lambda: f"COR-{uuid.uuid4().hex[:8].upper()}")
    visit_record_id = Column(String(50), ForeignKey("visit_records.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(50), nullable=False)
    original_value = Column(String(100), nullable=True)
    corrected_value = Column(String(100), nullable=False)
    corrected_by = Column(String(50), ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    visit_record = relationship("VisitRecord", back_populates="corrections")
