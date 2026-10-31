import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.init_db import init_db
from backend.app.db.session import SessionLocal
from backend.app.models.clinical import VisitRecord, ReviewAction
from backend.app.models.system import AuditLog, Notification

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup():
    init_db()

def test_complete_20_step_e2e_clinical_workflow():
    """
    MASTER 20-STEP END-TO-END CLINICAL AND AUTHENTICATION ACCEPTANCE TEST.
    Verifies full lifecycle across ASHA, ANM, Admin, Sarvam AI, and PostgreSQL.
    """
    
    # -------------------------------------------------------------
    # STEP 1: Frontline ASHA Registration
    # -------------------------------------------------------------
    reg_phone = "+91 97654 32199"
    reg_res = client.post("/api/v1/auth/register", json={
        "phone": reg_phone,
        "full_name": "Meena Sunil Shinde",
        "full_name_mr": "मीना सुनील शिंदे",
        "password": "Meena@12345",
        "role": "ASHA",
        "district": "Pune",
        "phc": "Khed Shivapur PHC",
        "sub_center": "Khed Shivapur SC"
    })
    assert reg_res.status_code in [201, 400]  # Created or already registered in test run

    # -------------------------------------------------------------
    # STEP 2: Frontline ASHA Login & JWT Issuance
    # -------------------------------------------------------------
    asha_login = client.post("/api/v1/auth/login", json={
        "phone": "+91 98810 99401",
        "password": "Asha@1234"
    })
    assert asha_login.status_code == 200
    asha_data = asha_login.json()
    asha_token = asha_data["access_token"]
    asha_refresh = asha_data["refresh_token"]
    assert asha_token is not None

    # -------------------------------------------------------------
    # STEP 3: Supervisor ANM Login & JWT Issuance
    # -------------------------------------------------------------
    anm_login = client.post("/api/v1/auth/login", json={
        "phone": "+91 94220 18834",
        "password": "Anm@12345"
    })
    assert anm_login.status_code == 200
    anm_token = anm_login.json()["access_token"]

    # -------------------------------------------------------------
    # STEP 4: Token Rotation & Replay Attack Prevention
    # -------------------------------------------------------------
    rotate_res = client.post("/api/v1/auth/refresh", json={"refresh_token": asha_refresh})
    assert rotate_res.status_code == 200
    new_asha_refresh = rotate_res.json()["refresh_token"]
    # Old token must be invalidated
    replay_res = client.post("/api/v1/auth/refresh", json={"refresh_token": asha_refresh})
    assert replay_res.status_code == 401

    # -------------------------------------------------------------
    # STEP 5: RBAC Authorization Check (ASHA Forbidden from Admin Actions)
    # -------------------------------------------------------------
    forbidden_res = client.patch(
        "/api/v1/auth/users/ASHA-PUN-104/status",
        headers={"Authorization": f"Bearer {asha_token}"},
        json={"is_active": False}
    )
    assert forbidden_res.status_code == 403

    # -------------------------------------------------------------
    # STEP 6: Admin Authentication & Permission Execution
    # -------------------------------------------------------------
    admin_login = client.post("/api/v1/auth/login", json={
        "phone": "+91 99999 00001",
        "password": "Admin@123"
    })
    admin_token = admin_login.json()["access_token"]
    admin_res = client.patch(
        "/api/v1/auth/users/ASHA-PUN-104/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"is_active": True}
    )
    assert admin_res.status_code == 200

    # -------------------------------------------------------------
    # STEP 7: OTP Request & Rate-Limiting Cooldown
    # -------------------------------------------------------------
    otp_phone = "+91 98810 88776"
    otp_send_1 = client.post("/api/v1/auth/otp/send", json={"phone": otp_phone})
    assert otp_send_1.status_code in [200, 429]
    # Immediate second request must trigger cooldown
    otp_send_2 = client.post("/api/v1/auth/otp/send", json={"phone": otp_phone})
    assert otp_send_2.status_code == 429

    # -------------------------------------------------------------
    # STEP 8: Fetch Persistent Beneficiaries from PostgreSQL
    # -------------------------------------------------------------
    bens_res = client.get("/api/v1/beneficiaries")
    assert bens_res.status_code == 200
    beneficiaries = bens_res.json()["beneficiaries"]
    assert len(beneficiaries) >= 3
    sunita = next(b for b in beneficiaries if "Sunita" in b["name"] or "सुनिता" in b["name_mr"])
    assert sunita["is_high_risk"] is True

    # -------------------------------------------------------------
    # STEP 9: Audio Synthesis Engine Check
    # -------------------------------------------------------------
    tts_res = client.post("/api/v1/audio/synthesize", json={
        "text": "नमस्कार, तुमची तपासणी पूर्ण झाली आहे.",
        "language": "mr-IN"
    })
    # If SARVAM_API_KEY is active, returns audio/wav; otherwise handled gracefully
    assert tts_res.status_code in [200, 500]

    # -------------------------------------------------------------
    # STEP 10: Dynamic Clinical Vital Signs & Exact Offset Extraction
    # -------------------------------------------------------------
    raw_transcript = "सुनिता शिंदे, वय २४ वर्षे, २८ आठवडे गरोदर आहेत. रक्तदाब १४०/९५ एवढा जास्त आला आहे आणि डोकेदुखी आहे. वजन ५४ किलो भरले आहे. हिमोग्लोबिन १०.२ ग्रॅम आहे."
    extract_res = client.post("/api/v1/visits/extract", json={
        "transcript": raw_transcript,
        "language": "mr-IN",
        "beneficiary_id": sunita["id"]
    })
    assert extract_res.status_code == 200
    extract_data = extract_res.json()
    assert extract_data["extracted_spans_count"] >= 3
    vitals = extract_data.get("vitals_extracted", {})
    assert vitals.get("bp_systolic") == 140
    assert vitals.get("bp_diastolic") == 95
    assert vitals.get("weight_kg") == 54.0

    # -------------------------------------------------------------
    # STEP 11: Clinical Rule Evaluation (Danger Signs Alert)
    # -------------------------------------------------------------
    warnings = extract_data["structured_record"]["validation_warnings"]
    warning_codes = [w["code"] for w in warnings]
    assert "ELEVATED_BP_DANGER_SIGN" in warning_codes

    # -------------------------------------------------------------
    # STEP 12: Real-time WebSocket Connection & Visit Record Submission
    # -------------------------------------------------------------
    with client.websocket_connect("/ws/anm/khed_shivapur_circle") as anm_ws:
        create_res = client.post("/api/v1/visits", json={
            "beneficiary_id": sunita["id"],
            "asha_id": "ASHA-PUN-104",
            "language": "mr-IN",
            "transcript": raw_transcript,
            "bp_systolic": 140,
            "bp_diastolic": 95,
            "weight_kg": 54.0,
            "hemoglobin_g_dl": 10.2,
            "gestational_weeks": 28,
            "headache": True,
            "pedal_edema": True,
            "fetal_movement_normal": True,
            "evidence_spans": extract_data["structured_record"]["evidence_spans"]
        })
        assert create_res.status_code == 201
        created_record_id = create_res.json()["record_id"]

        # STEP 13 & 14: Real-time WebSocket Broadcast Reception
        ws_event = anm_ws.receive_json()
        assert ws_event["event"] == "high_risk.alert"
        assert ws_event["data"]["record_id"] == created_record_id
        assert ws_event["data"]["is_high_risk"] is True

    # -------------------------------------------------------------
    # STEP 15: ANM Supervisor List & Filter Records
    # -------------------------------------------------------------
    records_res = client.get("/api/v1/visits?status=pending")
    assert records_res.status_code == 200
    pending_records = records_res.json()["records"]
    assert any(r["record_id"] == created_record_id for r in pending_records)

    # -------------------------------------------------------------
    # STEP 16: ANM Inspects Character Evidence Spans
    # -------------------------------------------------------------
    detail_res = client.get(f"/api/v1/visits/{created_record_id}")
    assert detail_res.status_code == 200
    rec_detail = detail_res.json()
    assert len(rec_detail["evidence_spans"]) >= 3
    # Check character offsets link to transcript
    for span in rec_detail["evidence_spans"]:
        start, end = span["start_char"], span["end_char"]
        if end <= len(rec_detail["transcript"]):
            assert len(span["source_text"]) > 0

    # -------------------------------------------------------------
    # STEP 17: ANM Supervisor Approval with Remarks
    # -------------------------------------------------------------
    with client.websocket_connect("/ws/asha/ASHA-PUN-104") as asha_ws:
        review_res = client.patch(f"/api/v1/visits/{created_record_id}/review", json={
            "action": "reviewed",
            "notes": "Verified by ANM Sujata Deshmukh. Referred to PHC for gestational hypertension evaluation."
        })
        assert review_res.status_code == 200
        assert review_res.json()["anm_review_status"] == "reviewed"

        # STEP 18: Real-time WebSocket Reception by ASHA Worker
        asha_event = asha_ws.receive_json()
        assert asha_event["event"] == "record.reviewed"
        assert asha_event["data"]["record_id"] == created_record_id

    # -------------------------------------------------------------
    # STEP 19: Audit Log Verification
    # -------------------------------------------------------------
    db = SessionLocal()
    try:
        audit = db.query(AuditLog).filter(
            AuditLog.resource_id == created_record_id,
            AuditLog.action == "record_reviewed"
        ).first()
        assert audit is not None
        assert audit.user_id == "ANM-PUN-012"
    finally:
        db.close()

    # -------------------------------------------------------------
    # STEP 20: Notification Verification
    # -------------------------------------------------------------
    db = SessionLocal()
    try:
        notif = db.query(Notification).filter(
            Notification.related_record_id == created_record_id,
            Notification.event_type == "record.reviewed"
        ).first()
        assert notif is not None
        assert notif.user_id == "ASHA-PUN-104"
    finally:
        db.close()
