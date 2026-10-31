import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.clinical_rules import ClinicalRuleValidator
from backend.app.schemas.visit import (
    StructuredVisitRecord, 
    VisitMeasurements, 
    PregnancyDetails, 
    SymptomsObservations, 
    ExtractedField, 
    ExtractionStatus
)

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "sarvam_saaras_adapter" in data

def test_list_beneficiaries():
    response = client.get("/api/v1/beneficiaries")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert any("Sunita" in b["name"] for b in data["beneficiaries"])

def test_list_visit_records():
    response = client.get("/api/v1/visits")
    assert response.status_code == 200
    data = response.json()
    assert len(data["records"]) >= 1

def test_clinical_rule_elevated_bp_pre_eclampsia():
    # Construct a test visit record with elevated BP >= 140/90 and headache
    rec = StructuredVisitRecord(
        beneficiary_id="BEN-TEST-001",
        beneficiary_name="Test Beneficiary",
        asha_id="ASHA-TEST",
        asha_name="Test ASHA",
        language="mr-IN",
        transcript="बीपी १४०/९५ एवढा जास्त भरला आहे आणि डोकेदुखी आहे.",
        measurements=VisitMeasurements(
            blood_pressure_systolic=ExtractedField(value=140, status=ExtractionStatus.CONCERNING, supporting_phrase="बीपी १४०/९५"),
            blood_pressure_diastolic=ExtractedField(value=95, status=ExtractionStatus.CONCERNING, supporting_phrase="बीपी १४०/९५"),
            hemoglobin_g_dl=ExtractedField(value=10.5, status=ExtractionStatus.EXTRACTED)
        ),
        pregnancy_details=PregnancyDetails(
            gestational_age_weeks=ExtractedField(value=28, status=ExtractionStatus.EXTRACTED)
        ),
        symptoms=SymptomsObservations(
            headache_or_blurred_vision=ExtractedField(value=True, status=ExtractionStatus.CONCERNING, supporting_phrase="डोकेदुखी आहे")
        )
    )

    warnings = ClinicalRuleValidator.validate_record(rec)
    codes = [w["code"] for w in warnings]
    assert "ELEVATED_BP_DANGER_SIGN" in codes
    assert "PRE_ECLAMPSIA_TRIAD" in codes

def test_clinical_rule_severe_anemia():
    # Test record with Hb < 7.0 g/dL
    rec = StructuredVisitRecord(
        beneficiary_id="BEN-TEST-002",
        beneficiary_name="Anemic Beneficiary",
        asha_id="ASHA-TEST",
        asha_name="Test ASHA",
        language="mr-IN",
        transcript="हिमोग्लोबिन ६.८ भरले आहे.",
        measurements=VisitMeasurements(
            blood_pressure_systolic=ExtractedField(value=110, status=ExtractionStatus.EXTRACTED),
            blood_pressure_diastolic=ExtractedField(value=70, status=ExtractionStatus.EXTRACTED),
            hemoglobin_g_dl=ExtractedField(value=6.8, status=ExtractionStatus.CONCERNING, supporting_phrase="हिमोग्लोबिन ६.८ भरले")
        ),
        pregnancy_details=PregnancyDetails(
            gestational_age_weeks=ExtractedField(value=30, status=ExtractionStatus.EXTRACTED)
        )
    )

    warnings = ClinicalRuleValidator.validate_record(rec)
    codes = [w["code"] for w in warnings]
    assert "SEVERE_ANEMIA_DANGER" in codes

def test_anm_review_workflow():
    # Fetch first record
    list_res = client.get("/api/v1/visits")
    rec_id = list_res.json()["records"][0]["record_id"]

    # Perform ANM review approval
    review_res = client.patch(f"/api/v1/visits/{rec_id}/review", json={
        "action": "reviewed",
        "notes": "Verified by ANM Sujata Deshmukh during field supervision."
    })
    assert review_res.status_code == 200
    data = review_res.json()
    assert data["success"] is True
    assert data["record"]["anm_review_status"] == "reviewed"

def test_sarvam_audio_transcribe_scenario():
    res = client.post("/api/v1/audio/transcribe", data={"scenario": "marathi_anc_high_risk"})
    assert res.status_code == 200
    data = res.json()
    assert "transcript" in data
    assert "बीपी १४०/९५" in data["transcript"]
    assert data["language"] == "mr-IN"
    assert data["status"] == "completed"

def test_sarvam_audio_synthesize_validation():
    res = client.post("/api/v1/audio/synthesize", json={})
    assert res.status_code == 400
    assert "Text is required" in res.json()["detail"]
