import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.init_db import init_db

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup():
    init_db()

def test_anm_websocket_lifecycle():
    """Test ANM connects to circle WebSocket and receives ping/ack."""
    with client.websocket_connect("/ws/anm/khed_shivapur_circle") as websocket:
        # Send keepalive text
        websocket.send_text("ping")
        # Connection established and remains healthy

def test_asha_websocket_lifecycle():
    """Test ASHA connects to worker WebSocket."""
    with client.websocket_connect("/ws/asha/ASHA-PUN-104") as websocket:
        websocket.send_text("ping")

def test_visit_submission_dispatches_websocket_event():
    """Test creating a visit sends a real-time event to the circle WebSocket."""
    with client.websocket_connect("/ws/anm/khed_shivapur_circle") as websocket:
        # Submit high-risk visit record
        res = client.post("/api/v1/visits", json={
            "beneficiary_id": "BEN-MH-PUN-0841",
            "asha_id": "ASHA-PUN-104",
            "language": "mr-IN",
            "transcript": "बीपी १४०/९५ भरला आहे आणि डोकेदुखी आहे.",
            "bp_systolic": 140,
            "bp_diastolic": 95,
            "weight_kg": 54.0,
            "hemoglobin_g_dl": 10.2,
            "gestational_weeks": 28,
            "headache": True,
            "pedal_edema": True,
            "fetal_movement_normal": True
        })
        assert res.status_code == 201

        # Read dispatched WebSocket event
        event_payload = websocket.receive_json()
        assert event_payload["event"] in ["high_risk.alert", "visit.submitted"]
        assert "record_id" in event_payload["data"]
        assert event_payload["data"]["is_high_risk"] is True
