import os
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.speech.sarvam_service import sarvam_speech_service
from backend.app.services.extraction.sarvam_extractor import sarvam_extractor
from backend.app.core.config import settings

client = TestClient(app)

def test_task6_real_sarvam_audio_file_transcription():
    """Verify transcription of actual Marathi audio file via Sarvam Saaras v3 adapter."""
    audio_path = "output_sarvam_welcome.wav"
    if not os.path.exists(audio_path):
        pytest.skip("Actual audio file output_sarvam_welcome.wav not found on disk.")

    with open(audio_path, "rb") as f:
        res = client.post(
            "/api/v1/audio/transcribe",
            data={"language": "mr-IN"},
            files={"audio_file": ("test_voice.wav", f, "audio/wav")}
        )

    assert res.status_code == 200
    data = res.json()
    assert "transcript" in data
    assert len(data["transcript"]) > 0
    # Verifies Marathi Devanagari characters preserved
    assert any('\u0900' <= char <= '\u097F' for char in data["transcript"])
    assert data["model"] == "sarvam-saaras-v3"
    assert data["status"] == "completed"

def test_task6_real_indic_llm_extraction_and_exact_spans():
    """
    Verify Sarvam LLM clinical extraction preserves exact character spans,
    converts Devanagari numerals, and leaves unmentioned fields as null.
    """
    # Spoken Marathi encounter with explicit BP and weight, but missing hemoglobin and gestational age
    sample_transcript = "आज मी सुनिता शिंदे यांच्या घरी भेट दिली. रक्तदाब १४०/९५ एवढा जास्त भरला आहे. वजन ५४ किलो भरले आहे."

    extract_res = client.post("/api/v1/visits/extract", json={
        "transcript": sample_transcript,
        "language": "mr-IN"
    })
    assert extract_res.status_code == 200
    extract_data = extract_res.json()

    record = extract_data["structured_record"]
    vitals = extract_data["vitals_extracted"]

    # 1. Numeric Extraction (Devanagari १४०/९५ -> integer 140, 95)
    assert vitals["bp_systolic"] == 140
    assert vitals["bp_diastolic"] == 95
    assert vitals["weight_kg"] == 54.0

    # 2. Missing fields must remain null (Zero Hallucination Principle)
    assert vitals["hemoglobin_g_dl"] is None
    assert vitals["gestational_weeks"] is None

    # 3. Exact Evidence Spans Traceability
    spans = record["evidence_spans"]
    assert len(spans) >= 2

    bp_span = next(s for s in spans if "blood_pressure" in s["field_name"])
    assert bp_span["start_char"] >= 0
    assert bp_span["end_char"] > bp_span["start_char"]
    # Verify exact character slice matches source text in original transcript
    extracted_slice = sample_transcript[bp_span["start_char"]:bp_span["end_char"]]
    assert extracted_slice == bp_span["source_text"]

def test_task6_production_mode_rejects_audio_demo_substitution():
    """
    TASK 6 MANDATE: In production mode, do NOT substitute sample transcripts when provider calls fail.
    Verify that omitting audio file in production mode raises 400 Bad Request instead of returning demo data.
    """
    original_env = settings.ENVIRONMENT
    try:
        settings.ENVIRONMENT = "production"

        # Calling transcribe without audio file in production mode must be rejected
        res = client.post("/api/v1/audio/transcribe", data={"scenario": "marathi_anc_high_risk"})
        assert res.status_code == 400
        assert "production" in res.json()["detail"].lower()
    finally:
        settings.ENVIRONMENT = original_env
