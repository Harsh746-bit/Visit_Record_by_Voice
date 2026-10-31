from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_pnc_visit_retrieval_and_evidence():
    """Verify PNC visit record is retrieved with exact clinical evidence spans."""
    res = client.get("/api/v1/visits")
    assert res.status_code == 200
    data = res.json()
    records = data["records"]
    
    pnc_records = [r for r in records if r.get("visit_type") == "PNC"]
    assert len(pnc_records) >= 1
    pnc = pnc_records[0]
    
    assert pnc["beneficiary_id"] == "BEN-MH-PUN-0845"
    assert "बाळंतपणानंतरची" in pnc["transcript"]
    assert pnc["bp_systolic"] == 120
    assert pnc["bp_diastolic"] == 80
    
    # Verify evidence spans
    span_fields = [s["field_name"] for s in pnc["evidence_spans"]]
    assert "postnatal_day" in span_fields
    assert "exclusive_breastfeeding" in span_fields
    assert "cord_condition" in span_fields

def test_immunization_visit_retrieval_and_evidence():
    """Verify Child Immunization visit record is retrieved with vaccine spans."""
    res = client.get("/api/v1/visits")
    assert res.status_code == 200
    data = res.json()
    records = data["records"]
    
    imm_records = [r for r in records if r.get("visit_type") == "IMMUNIZATION"]
    assert len(imm_records) >= 1
    imm = imm_records[0]
    
    assert imm["beneficiary_id"] == "BEN-MH-PUN-0845"
    assert "लसीकरण" in imm["transcript"]
    assert imm["weight_kg"] == 4.1
    
    # Verify vaccine evidence spans
    span_fields = [s["field_name"] for s in imm["evidence_spans"]]
    assert "vaccines_administered" in span_fields
    assert "adverse_events_absent" in span_fields
