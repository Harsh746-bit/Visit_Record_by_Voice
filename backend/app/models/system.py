import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, Integer, DateTime, 
    ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship

from backend.app.db.session import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(50), primary_key=True, default=lambda: f"NOTIF-{uuid.uuid4().hex[:8].upper()}")
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    title_mr = Column(String(150), nullable=True)
    message = Column(Text, nullable=False)
    message_mr = Column(Text, nullable=True)
    event_type = Column(String(50), default="visit.submitted", nullable=False)
    related_record_id = Column(String(50), nullable=True, index=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, default=lambda: f"AUD-{uuid.uuid4().hex[:8].upper()}")
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(50), nullable=False, index=True) # login, logout, create_visit, review_record, return_record
    resource_type = Column(String(50), nullable=False) # visit, user, beneficiary
    resource_id = Column(String(50), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class AshaAssignment(Base):
    __tablename__ = "asha_assignments"

    id = Column(String(50), primary_key=True, default=lambda: f"ASG-{uuid.uuid4().hex[:8].upper()}")
    asha_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    area_code = Column(String(50), nullable=False)
    village = Column(String(100), nullable=False)
    sub_center = Column(String(100), nullable=False)
    assigned_by = Column(String(50), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class AnmAreaAssignment(Base):
    __tablename__ = "anm_area_assignments"

    id = Column(String(50), primary_key=True, default=lambda: f"ANMASG-{uuid.uuid4().hex[:8].upper()}")
    anm_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    phc_name = Column(String(100), nullable=False)
    circle_name = Column(String(100), nullable=False)
    assigned_by = Column(String(50), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
