import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.session import SessionLocal
from backend.app.db.init_db import init_db
from backend.app.models.user import User, UserRole, normalize_phone
from backend.app.models.clinical import Visit, VisitRecord, EvidenceSpan, ReviewStatus

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup():
    init_db()

def test_task4_cross_client_account_and_review_lifecycle():
    """
    TASK 4 — CROSS-CLIENT ACCOUNT TEST:
    1. Create an ASHA account.
    2. Create an ANM account.
    3. Authenticate ASHA in Android.
    4. Authenticate ANM in the web dashboard.
    5. Create a visit from Android.
    6. Confirm persistence in PostgreSQL.
    7. Open the same record in the ANM dashboard.
    8. Update its review status.
    9. Verify the updated status in Android.
    """
    asha_phone = "+91 98810 77112"
    anm_phone = "+91 94220 77223"
    asha_pwd = "Asha#CrossTest_2026"
    anm_pwd = "Anm#CrossTest_2026"

    # Clean previous run data if any
    db = SessionLocal()
    try:
        db.query(User).filter(User.phone.in_([normalize_phone(asha_phone), normalize_phone(anm_phone)])).delete(synchronize_session=False)
        db.commit()
    finally:
        db.close()

    # -------------------------------------------------------------
    # 1. Create an ASHA account
    # -------------------------------------------------------------
    asha_reg = client.post("/api/v1/auth/register", json={
        "phone": asha_phone,
        "full_name": "Lata Shivaji Shinde",
        "full_name_mr": "लता शिवाजी शिंदे",
        "password": asha_pwd,
        "role": "ASHA",
        "district": "Pune",
        "phc": "Khed Shivapur Primary Health Center",
        "sub_center": "Shivapur Sub-Center",
        "village": "Shivapur"
    })
    assert asha_reg.status_code == 201

    # -------------------------------------------------------------
    # 2. Create an ANM account
    # -------------------------------------------------------------
    anm_reg = client.post("/api/v1/auth/register", json={
        "phone": anm_phone,
        "full_name": "Deepa Madhav Rao",
        "full_name_mr": "दीपा माधव राव",
        "password": anm_pwd,
        "role": "ANM",
        "district": "Pune",
        "phc": "Khed Shivapur Primary Health Center",
        "sub_center": "Khed Shivapur Circle",
        "village": "Khed Shivapur"
    })
    assert anm_reg.status_code == 201

    # -------------------------------------------------------------
    # 3. Authenticate ASHA in Android (Mobile App Session)
    # -------------------------------------------------------------
    asha_auth = client.post("/api/v1/auth/login", json={
        "phone": asha_phone,
        "password": asha_pwd
    })
    assert asha_auth.status_code == 200
    asha_token = asha_auth.json()["access_token"]
    assert asha_token is not None

    # -------------------------------------------------------------
    # 4. Authenticate ANM in Web Dashboard (Supervisor Session)
    # -------------------------------------------------------------
    anm_auth = client.post("/api/v1/auth/login", json={
        "phone": anm_phone,
        "password": anm_pwd
    })
    assert anm_auth.status_code == 200
    anm_token = anm_auth.json()["access_token"]
    assert anm_token is not None

    # -------------------------------------------------------------
    # 5. Create a visit from Android (ASHA field encounter)
    # -------------------------------------------------------------
    transcript_text = "आज सुनिता शिंदे यांच्या घरी भेट दिली. रक्तदाब १३०/८५ भरला आहे. वजन ५३ किलो भरले आहे."
    create_visit_res = client.post(
        "/api/v1/visits",
        headers={"Authorization": f"Bearer {asha_token}"},
        json={
            "beneficiary_id": "BEN-MH-PUN-0841",
            "asha_id": asha_auth.json()["user"]["id"],
            "language": "mr-IN",
            "transcript": transcript_text,
            "bp_systolic": 130,
            "bp_diastolic": 85,
            "weight_kg": 53.0,
            "fetal_movement_normal": True
        }
    )
    assert create_visit_res.status_code == 201
    created_rec_id = create_visit_res.json()["record_id"]

    # -------------------------------------------------------------
    # 6. Confirm persistence in PostgreSQL
    # -------------------------------------------------------------
    db = SessionLocal()
    try:
        pg_rec = db.query(VisitRecord).filter(VisitRecord.id == created_rec_id).first()
        assert pg_rec is not None
        assert pg_rec.transcript == transcript_text
        assert pg_rec.bp_systolic == 130
        assert pg_rec.bp_diastolic == 85
        assert pg_rec.anm_review_status == ReviewStatus.PENDING

        # Check evidence spans persisted
        spans = db.query(EvidenceSpan).filter(EvidenceSpan.visit_record_id == created_rec_id).all()
        assert len(spans) >= 1
    finally:
        db.close()

    # -------------------------------------------------------------
    # 7. Open the same record in the ANM dashboard
    # -------------------------------------------------------------
    anm_get_res = client.get(
        f"/api/v1/visits/{created_rec_id}",
        headers={"Authorization": f"Bearer {anm_token}"}
    )
    assert anm_get_res.status_code == 200
    anm_view_data = anm_get_res.json()
    assert anm_view_data["record_id"] == created_rec_id
    assert anm_view_data["bp_systolic"] == 130
    assert anm_view_data["anm_review_status"] == "pending"

    # -------------------------------------------------------------
    # 8. Update its review status (ANM approves with remarks)
    # -------------------------------------------------------------
    supervisor_notes = "सुजाता देशमुख (ANM): रक्तदाब नियंत्रणात आहे. नियमित तपासणी सुरू ठेवावी."
    review_res = client.patch(
        f"/api/v1/visits/{created_rec_id}/review",
        headers={"Authorization": f"Bearer {anm_token}"},
        json={
            "action": "reviewed",
            "notes": supervisor_notes
        }
    )
    assert review_res.status_code == 200
    assert review_res.json()["record"]["anm_review_status"] == "reviewed"

    # -------------------------------------------------------------
    # 9. Verify the updated status in Android (ASHA App Refresh)
    # -------------------------------------------------------------
    asha_refresh_res = client.get(
        f"/api/v1/visits/{created_rec_id}",
        headers={"Authorization": f"Bearer {asha_token}"}
    )
    assert asha_refresh_res.status_code == 200
    refreshed_data = asha_refresh_res.json()
    assert refreshed_data["record_id"] == created_rec_id
    assert refreshed_data["anm_review_status"] == "reviewed"
    assert refreshed_data["anm_review_notes"] == supervisor_notes
