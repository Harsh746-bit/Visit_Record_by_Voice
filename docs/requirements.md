# Product Requirements Document — Visit Record by Voice

## 1. Product Scope & User Personas

### Persona 1: ASHA Worker (Accredited Social Health Activist)
- **Role**: Frontline community health worker in rural/semi-urban Maharashtra (e.g., Pune and Nashik circles).
- **Core Needs**: Fast, hands-free visit documentation without tedious manual entry across multiple physical registers (RCH register, ANC book, immunization logs).
- **Key Constraints**: Modest smartphone hardware, intermittent cellular connectivity, non-technical background, primary language Marathi or Hindi.

### Persona 2: ANM (Auxiliary Nurse Midwife)
- **Role**: Healthcare supervisor managing 4–8 ASHA workers across primary health sub-centres.
- **Core Needs**: Rapid oversight of visit records, immediate triage of high-risk pregnancies (elevated BP, severe anemia), verification of evidence before central state sync.

---

## 2. Functional Requirements

### FR-01: Multilingual Voice Capture & Audio Storage
- Frontline workers must be able to record visit notes in **Marathi (मराठी)**, **Hindi (हिन्दी)**, or colloquial code-mixed speech with English medical terminology.
- Audio must be recorded in 16 kHz Mono WAV/M4A format.
- Audio recordings must be temporarily cached locally in Room/local storage until successful synchronization.

### FR-02: Speech Recognition (Sarvam Saaras Indic ASR)
- Audio must be transcribed into UTF-8 Devanagari text preserving verbatim spoken vocabulary.
- The ASR adapter must support benchmark comparisons and graceful fallback if network timeouts occur.

### FR-03: Structured Clinical Information Extraction
- The system must extract predefined fields:
  - **Measurements**: Blood pressure (systolic/diastolic), weight (kg), hemoglobin (g/dL), blood sugar (mg/dL).
  - **Pregnancy Details**: Gestational age (weeks), trimester, gravida, parity, EDD, high-risk flags.
  - **Symptoms & Observations**: Fever, headache/blurred vision, pedal edema, vaginal bleeding, fetal movements.
  - **Interventions**: IFA tablets distributed, calcium tablets, PHC/hospital referral.
- **Strict Grounding Rule**: Missing values must remain `null`. The system must NEVER invent or hallucinate clinical numbers.

### FR-04: Deterministic Evidence Span Attribution
- Every extracted clinical field must include an `EvidenceSpan`:
  - `start_char` and `end_char` offsets in the original transcript.
  - Exact verbatim `source_text`.
  - Confidence metric and extraction status.
- Selecting any field in the UI must highlight its exact source phrase in the transcript.

### FR-05: Independent Clinical Rule-Based Validation
- The system must identify:
  - Critical missing fields.
  - Invalid formats or physiological inversions (e.g., Systolic BP $\le$ Diastolic BP).
  - High-risk danger signs explicitly mentioned:
    - Systolic BP $\ge 140$ or Diastolic $\ge 90$ mmHg (Pre-eclampsia risk).
    - Hemoglobin $< 7.0$ g/dL (Severe gestational anemia).
    - Vaginal bleeding or reduced fetal movements.
- **Important**: The system must NEVER generate automated medical diagnoses or drug prescriptions.

### FR-06: Explicit Frontline Worker Sign-off
- No AI-generated visit record can be finalized or submitted without explicit human review and confirmation by the ASHA worker.

### FR-07: ANM Supervisory Review Workflow
- Authorized ANMs can review submitted records, examine the split evidence review, approve the record, or return it for correction with written remarks.

### FR-08: Offline-First Operation
- Frontline app must allow creating, editing, and storing drafts offline with duplicate submission prevention.

---

## 3. Non-Functional Requirements
- **Performance**: ASR + extraction processing under 6 seconds on standard 4G networks.
- **Accessibility**: Minimum 48dp touch targets on mobile; high color contrast compliant with WCAG AA.
- **Privacy**: Zero exposure of patient PII; synthetic demo datasets; 30-day raw audio retention policy.
- **Reliability**: Graceful offline fallback with local draft recovery.
