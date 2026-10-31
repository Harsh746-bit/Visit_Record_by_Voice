# API Contracts Specification — Visit Record by Voice

## Base URL
`/api/v1`

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates an ASHA worker or ANM supervisor.

#### Request Body
```json
{
  "phone": "+91 98810 99401",
  "password": "secret_password",
  "role": "asha"
}
```

#### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "ASHA-PUN-104",
    "name": "Rukmini Vithal Jadhav",
    "role": "asha",
    "assigned_area": "Khed Shivapur Circle, Pune",
    "phone": "+91 98810 99401"
  }
}
```

---

## 2. Beneficiaries Endpoints

### `GET /api/v1/beneficiaries`
List beneficiaries assigned to the authenticated user's circle.

#### Query Parameters
- `query` (optional string): Filter by name, village, or RCH ID.

#### Response (200 OK)
```json
{
  "beneficiaries": [
    {
      "id": "BEN-MH-PUN-0841",
      "name": "Sunita Sanjay Shinde",
      "name_mr": "सुनिता संजय शिंदे",
      "age": 24,
      "village": "Khed Shivapur, Pune",
      "sub_center": "Shivapur Sub-Center",
      "phc": "Khed PHC",
      "category": "Pregnant Woman (ANC)",
      "gravida": 2,
      "parity": 1,
      "gestational_weeks": 28,
      "high_risk": true,
      "high_risk_reasons": ["High Blood Pressure (>140/90)", "Previous C-section"],
      "assigned_asha_id": "ASHA-PUN-104",
      "rch_id": "MH-27-04-2026-0912"
    }
  ],
  "total": 1
}
```

---

## 3. Voice & Speech Recognition Endpoints

### `POST /api/v1/voice/transcribe`
Submits recorded audio for Sarvam Saaras v3 ASR transcription.

#### Request (Multipart Form Data)
- `audio_file`: Binary audio file (WAV/M4A/MP3, max 25MB)
- `language`: `mr-IN` (Marathi) or `hi-IN` (Hindi)
- `model_version`: (Optional) `sarvam-saaras-v3`

#### Response (200 OK)
```json
{
  "transcript": "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. तिचा रक्तदाब बीपी १४०/९५ एवढा जास्त भरला आहे.",
  "language": "mr-IN",
  "confidence": 0.96,
  "duration_seconds": 44.2,
  "model_used": "sarvam-saaras-v3"
}
```

---

## 4. Clinical Extraction & Evidence Mapping

### `POST /api/v1/voice/extract`
Processes a verbatim transcript and produces a structured clinical schema with deterministic character offsets.

#### Request Body
```json
{
  "transcript": "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. तिचा रक्तदाब बीपी १४०/९५ एवढा जास्त भरला आहे. वजन ५४ किलो आहे.",
  "language": "mr-IN",
  "beneficiary_id": "BEN-MH-PUN-0841"
}
```

#### Response (200 OK)
```json
{
  "structured_record": {
    "record_id": "REC-2026-PUN-0914",
    "beneficiary_id": "BEN-MH-PUN-0841",
    "language": "mr-IN",
    "measurements": {
      "blood_pressure_systolic": {
        "value": 140,
        "unit": "mmHg",
        "supporting_phrase": "बीपी १४०/९५",
        "status": "concerning",
        "confidence": 0.99
      },
      "blood_pressure_diastolic": {
        "value": 95,
        "unit": "mmHg",
        "supporting_phrase": "बीपी १४०/९५",
        "status": "concerning",
        "confidence": 0.99
      },
      "weight_kg": {
        "value": 54.0,
        "unit": "kg",
        "supporting_phrase": "वजन ५४ किलो आहे",
        "status": "extracted",
        "confidence": 0.96
      }
    },
    "evidence_spans": [
      {
        "field_name": "blood_pressure_systolic",
        "extracted_value": 140,
        "start_char": 64,
        "end_char": 73,
        "source_text": "बीपी १४०/९५",
        "confidence": 0.99,
        "status": "concerning"
      }
    ],
    "validation_warnings": [
      {
        "field": "blood_pressure",
        "severity": "critical",
        "code": "ELEVATED_BP_DANGER_SIGN",
        "message_en": "Blood Pressure (140/95 mmHg) is elevated (>= 140/90).",
        "message_mr": "रक्तदाब (१४०/९५ mmHg) जास्त आहे (>= १४०/९०)."
      }
    ]
  }
}
```

---

## 5. Review & Approval Endpoints

### `PATCH /api/v1/records/{record_id}/review`
ANM supervisor review decision.

#### Request Body
```json
{
  "action": "reviewed",
  "notes": "Verified vital parameters. MO referral tracked for elevated BP."
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Record reviewed by ANM supervisor",
  "record_id": "REC-2026-PUN-0914",
  "anm_review_status": "reviewed"
}
```
