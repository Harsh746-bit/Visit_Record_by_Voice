import logging
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.app.db.session import engine, Base, SessionLocal
from backend.app.models.user import User, UserRole, normalize_phone
from backend.app.models.clinical import (
    Beneficiary, Visit, VisitRecord, VisitType, ReviewStatus, EvidenceSpan
)
from backend.app.models.system import AshaAssignment, AnmAreaAssignment
from backend.app.security.password import hash_password
from backend.app.data.synthetic_data import (
    SYNTHETIC_BENEFICIARIES, 
    SYNTHETIC_WORKERS, 
    DEMO_VISIT_SCENARIOS
)

logger = logging.getLogger(__name__)

def init_db(db: Session = None):
    """
    Creates database tables and seeds real accounts and initial beneficiaries.
    """
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True

    try:
        # 1. Seed Real Users with Argon2id Password Hashes
        users_to_seed = [
            {
                "id": "ADMIN-001",
                "phone": "+91 99999 00001",
                "email": "admin@arogya.maharashtra.gov.in",
                "full_name": "Dr. Anand Joshi",
                "full_name_mr": "डॉ. आनंद जोशी",
                "role": UserRole.ADMIN,
                "password": "Admin@123",
                "district": "Pune",
                "phc": "District Health Office, Pune",
                "sub_center": "Central Administrative Circle",
                "village": "Pune City"
            },
            {
                "id": "ANM-PUN-012",
                "phone": "+91 94220 18834",
                "email": "sujata.deshmukh@arogya.maharashtra.gov.in",
                "full_name": "Sujata Deshmukh",
                "full_name_mr": "सुजाता देशमुख",
                "role": UserRole.ANM,
                "password": "Anm@12345",
                "district": "Pune",
                "phc": "Khed Shivapur Primary Health Center",
                "sub_center": "Khed Shivapur Circle",
                "village": "Khed Shivapur"
            },
            {
                "id": "ASHA-PUN-104",
                "phone": "+91 98810 99401",
                "email": "rukmini.jadhav@arogya.maharashtra.gov.in",
                "full_name": "Rukmini Vithal Jadhav",
                "full_name_mr": "रुक्मिणी विठ्ठल जाधव",
                "role": UserRole.ASHA,
                "password": "Asha@1234",
                "district": "Pune",
                "phc": "Khed Shivapur Primary Health Center",
                "sub_center": "Khed Shivapur Sub-Center",
                "village": "Khed Shivapur"
            },
            {
                "id": "ASHA-NAS-201",
                "phone": "+91 94220 88219",
                "email": "surekha.more@arogya.maharashtra.gov.in",
                "full_name": "Surekha Kailas More",
                "full_name_mr": "सुरेखा कैलास मोरे",
                "role": UserRole.ASHA,
                "password": "Asha@1234",
                "district": "Nashik",
                "phc": "Trimbakeshwar Rural Health Center",
                "sub_center": "Trimbakeshwar Sub-Center",
                "village": "Trimbak"
            }
        ]

        for u_data in users_to_seed:
            clean_phone = normalize_phone(u_data["phone"])
            existing = db.query(User).filter((User.phone == clean_phone) | (User.phone == u_data["phone"])).first()
            if not existing:
                pwd_hash = hash_password(u_data["password"])
                user = User(
                    id=u_data["id"],
                    phone=clean_phone,
                    email=u_data["email"],
                    full_name=u_data["full_name"],
                    full_name_mr=u_data["full_name_mr"],
                    role=u_data["role"],
                    password_hash=pwd_hash,
                    is_active=True,
                    district=u_data["district"],
                    phc=u_data["phc"],
                    sub_center=u_data["sub_center"],
                    village=u_data["village"]
                )
                db.add(user)
            else:
                existing.phone = clean_phone

        db.commit()

        # 2. Seed Beneficiaries
        for b_data in SYNTHETIC_BENEFICIARIES:
            existing_ben = db.query(Beneficiary).filter(Beneficiary.id == b_data["id"]).first()
            if not existing_ben:
                hr_reasons = b_data.get("high_risk_reasons")
                if isinstance(hr_reasons, list):
                    hr_reasons = ", ".join(hr_reasons)

                ben = Beneficiary(
                    id=b_data["id"],
                    rch_id=b_data.get("rch_id", f"MH-RCH-{b_data['id']}"),
                    full_name=b_data["name"],
                    full_name_mr=b_data.get("name_mr", b_data["name"]),
                    age=b_data["age"],
                    category=b_data.get("category", "ANC"),
                    gestational_weeks=b_data.get("gestational_weeks", 20),
                    edd=b_data.get("edd"),
                    is_high_risk=b_data.get("is_high_risk", False),
                    high_risk_reasons=hr_reasons,
                    assigned_asha_id=b_data.get("assigned_asha_id", "ASHA-PUN-104"),
                    village=b_data.get("village", "Khed Shivapur"),
                    sub_center=b_data.get("sub_center", "Khed Shivapur Sub-Center"),
                    contact_phone=b_data.get("contact_phone", "+91 98000 00000")
                )
                db.add(ben)

        db.commit()

        # 3. Seed Initial Visits & Traceable Evidence Spans
        for s_key, scenario in DEMO_VISIT_SCENARIOS.items():
            existing_visit = (
                db.query(Visit)
                .filter(Visit.beneficiary_id == scenario["beneficiary_id"])
                .first()
            )
            if not existing_visit:
                visit = Visit(
                    id=f"VST-{s_key[:8].upper()}",
                    beneficiary_id=scenario["beneficiary_id"],
                    asha_id=scenario["asha_id"],
                    visit_type=VisitType.ANC,
                    encounter_date=datetime.now(timezone.utc),
                    sync_status="synced"
                )
                db.add(visit)
                db.flush()

                rec = VisitRecord(
                    id=f"REC-2026-PUN-{scenario['beneficiary_id'][-4:]}",
                    visit_id=visit.id,
                    language=scenario["language"],
                    transcript=scenario["transcript"],
                    audio_duration_seconds=42.5,
                    bp_systolic=140 if "high_risk" in s_key else 118,
                    bp_diastolic=95 if "high_risk" in s_key else 76,
                    weight_kg=54.0 if "high_risk" in s_key else 49.0,
                    hemoglobin_g_dl=10.2 if "high_risk" in s_key else 11.5,
                    gestational_weeks=28 if "high_risk" in s_key else 16,
                    headache=True if "high_risk" in s_key else False,
                    pedal_edema=True if "high_risk" in s_key else False,
                    fetal_movement_normal=True,
                    ifa_tablets_given=True,
                    referral_recommended=True if "high_risk" in s_key else False,
                    is_confirmed_by_asha=True,
                    confirmed_at=datetime.now(timezone.utc),
                    anm_review_status=ReviewStatus.PENDING if "high_risk" in s_key else ReviewStatus.REVIEWED,
                    anm_review_notes="Urgent MO consultation recommended for elevated BP" if "high_risk" in s_key else "Verified and approved by ANM."
                )
                db.add(rec)
                db.flush()

                for span_data in scenario["evidence_spans"]:
                    span = EvidenceSpan(
                        visit_record_id=rec.id,
                        field_name=span_data["field_name"],
                        extracted_value=span_data["extracted_value"],
                        start_char=span_data["start_char"],
                        end_char=span_data["end_char"],
                        source_text=span_data["source_text"],
                        confidence=span_data.get("confidence", 0.98),
                        status=span_data.get("status", "extracted")
                    )
                    db.add(span)

        db.commit()
        logger.info("Database initialized and baseline data seeded successfully.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise e
    finally:
        if close_session:
            db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialization script finished successfully.")
