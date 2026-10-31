# Data Privacy & Medical Ethics Protocol — Visit Record by Voice

## 1. Ethical Principles for Frontline AI Healthcare
1. **Human-in-the-Loop Supremacy**: Frontline ASHA workers and ANMs maintain total authority over all generated records. The AI functions solely as a voice scribe, never as an autonomous diagnostician.
2. **Deterministic Evidence Attribution**: No clinical value may be saved without verifiable evidence traceable to the raw spoken audio.
3. **Synthetic Data Policy**: All hackathon demonstrations and testing environments strictly utilize generated synthetic personas. No real patient health information (PHI) is ever ingested.

---

## 2. Audio Data Lifecycle & Retention Policy
- **Temporary Ingestion**: Spoken audio is uploaded over TLS 1.3 to the backend ASR adapter.
- **Processing Window**: Sarvam Saaras converts audio to Devanagari text; raw audio is retained locally in application cache for verification playback.
- **Auto-Scrubbing Policy**: Raw audio files are scheduled for automatic deletion 30 days after supervisory ANM review sign-off.
- **Permanent Record**: The human-verified, structured visit record (measurements, symptoms, interventions) persists permanently in the primary health center database.

---

## 3. Frontline Recording Consent Workflow
- Before any audio recording begins, the mobile interface presents an explicit audio consent reminder to the ASHA worker:
  > *"Speak naturally about the home visit. Ensure the beneficiary has provided verbal consent for voice documentation."*
  > *"घरभेटीबद्दल नैसर्गिकरीत्या बोला. लाभार्थी मातेची तोंडी संमती घेतली असल्याची खात्री करा."*
- Recording can be cancelled at any point, immediately purging the temporary in-memory audio buffer without saving.

---

## 4. Role-Based Access Control (RBAC)
- **ASHA Worker**: Can only access, record, and view beneficiaries assigned to their specific sub-center village circle.
- **ANM Supervisor**: Can only review records belonging to their assigned primary health center jurisdiction.
- **Medical Officer**: Retains read access for clinical triage and hospital referral escalation.
- **Audit Logging**: Every create, edit, verification, and review action is immutably logged with actor ID, timestamp, and modification details.
