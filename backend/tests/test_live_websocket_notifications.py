import pytest
import json
from starlette.websockets import WebSocketDisconnect
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.security.tokens import create_access_token
from backend.app.core.config import settings

client = TestClient(app)

def test_task5_unauthorized_websocket_rejected():
    """Verify unauthorized WebSocket connections are rejected with code 1008."""
    # 1. Connection with invalid/tampered token
    with pytest.raises(WebSocketDisconnect) as exc_info:
        with client.websocket_connect("/ws/anm/khed_shivapur_circle?token=invalid_tampered_jwt"):
            pass
    assert exc_info.value.code == 1008

    # 2. Connection with ASHA token to ANM supervisor endpoint must be rejected (role check)
    asha_token, _, _ = create_access_token(user_id="ASHA-104", role="ASHA", phone="+919881099401")
    with pytest.raises(WebSocketDisconnect) as exc_info:
        with client.websocket_connect(f"/ws/anm/khed_shivapur_circle?token={asha_token}"):
            pass
    assert exc_info.value.code == 1008

def test_task5_authorized_websocket_lifecycle_and_reconnection():
    """Verify authorized connection, live event reception, and reconnection handling."""
    anm_token, _, _ = create_access_token(user_id="ANM-012", role="ANM", phone="+919422018834")
    asha_token, _, _ = create_access_token(user_id="ASHA-PUN-104", role="ASHA", phone="+919881099401")

    # 1. ANM connects with valid token
    with client.websocket_connect(f"/ws/anm/khed_shivapur_circle?token={anm_token}") as anm_ws:
        # Submit a visit
        create_res = client.post("/api/v1/visits", json={
            "beneficiary_id": "BEN-MH-PUN-0841",
            "asha_id": "ASHA-PUN-104",
            "language": "mr-IN",
            "transcript": "बीपी १४०/९५ भरला आहे.",
            "bp_systolic": 140,
            "bp_diastolic": 95,
            "weight_kg": 54.0,
            "fetal_movement_normal": True
        })
        assert create_res.status_code == 201
        created_id = create_res.json()["record_id"]

        # Receive real-time event (high_risk.alert for BP 140/95)
        raw_event = anm_ws.receive_text()
        event_data = json.loads(raw_event)
        assert event_data["event"] in ["visit.submitted", "high_risk.alert"]
        assert event_data["data"]["record_id"] == created_id

    # 2. Simulate network interruption and reconnection
    with client.websocket_connect(f"/ws/anm/khed_shivapur_circle?token={anm_token}") as anm_reconnected_ws:
        assert anm_reconnected_ws is not None

    # 3. Test record returned for correction -> ASHA receives notification
    with client.websocket_connect(f"/ws/asha/ASHA-PUN-104?token={asha_token}") as asha_ws:
        # ANM returns the record with remarks
        return_res = client.patch(f"/api/v1/visits/{created_id}/review", json={
            "action": "returned",
            "notes": "कृपया पुन्हा रक्तदाब तपासा आणि खात्री करा."
        })
        assert return_res.status_code == 200

        # ASHA receives live event
        asha_raw = asha_ws.receive_text()
        asha_event = json.loads(asha_raw)
        assert asha_event["event"] == "record.returned"
        assert asha_event["data"]["record_id"] == created_id
        assert "पुन्हा रक्तदाब" in asha_event["data"]["notes"]
