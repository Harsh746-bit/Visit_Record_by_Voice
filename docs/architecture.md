# Architecture Document — Visit Record by Voice

## 1. System Topology & Architectural Philosophy
**Visit Record by Voice** is a specialized, human-centered multilingual healthcare documentation and clinical supervision platform built for frontline **ASHA workers** and **ANMs (Auxiliary Nurse Midwives)** in Maharashtra, India.

### Core Architectural Principle
> *"AI generates the record, evidence explains the record, and the healthcare worker makes the final decision."*

```
Frontline ASHA Worker (Spoken Encounter in Marathi / Hindi)
       │
       ▼
Local Audio & Draft Storage (Room DB / Offline-First)
       │
       ▼
Secure Indic Audio Upload (Multipart / TLS 1.3)
       │
       ▼
Speech-to-Text Pipeline (Sarvam Saaras v3 Indic ASR Adapter)
       │
       ▼
Verbatim Transcript (Devanagari Unicode UTF-8)
       │
       ▼
Structured Clinical Extraction (LLM + Strict Pydantic Schema)
       │
       ▼
Deterministic Evidence Span Alignment (Char Offsets & String Matches)
       │
       ▼
Rule-Based Clinical Validator (Elevated BP, Severe Anemia, Obstetric Danger Signs)
       │
       ▼
Frontline Human Verification (ASHA Worker Explicit Sign-off)
       │
       ▼
PostgreSQL / Relational Store & ANM Supervisory Review Queue
       │
       ▼
ANM Supervisor Decision (Approve / Return with Remarks / MO Referral)
```

---

## 2. Technology Selection Rationale

| Layer | Technology | Engineering Rationale |
|---|---|---|
| **Frontline Mobile** | **Kotlin + Jetpack Compose** | Native Android UI optimized for entry-level devices in rural Maharashtra. Material 3 ensures minimum 48dp touch targets and high-contrast Devanagari font rendering. |
| **Mobile State & Storage** | **MVVM + StateFlow + Room** | Offline-first architecture allowing ASHAs to capture visit notes without internet connectivity; syncs automatically when 4G/Wi-Fi returns. |
| **Web Dashboard** | **React 19 + TypeScript + Vite + Tailwind CSS** | Fast desktop-first supervisor portal for ANMs; features interactive split-screen evidence review, Recharts indicators, and embedded ASHA simulator. |
| **Backend Framework** | **Python FastAPI + Pydantic v2** | High-throughput asynchronous REST API with auto-generated OpenAPI documentation and strict data validation for clinical schemas. |
| **Database** | **PostgreSQL + SQLAlchemy 2.0** | Enterprise relational storage with ACID compliance, role-based row security, and foreign-key audit trails. SQLite used for instant local/hackathon portability. |
| **Speech Recognition (ASR)** | **Sarvam Saaras v3 (Indic ASR)** | State-of-the-art acoustic models fine-tuned on Indic regional dialects, supporting Marathi (मराठी), Hindi (हिन्दी), and mixed-language medical jargon. |
| **Clinical Extraction** | **Indic LLM + Deterministic Offset Engine** | Extracts clinical fields only when supported by source words; computes exact character start and end offsets to eliminate AI hallucinations. |

---

## 3. Subsystem Breakdown

### A. Frontline ASHA Subsystem
- **Bilingual Interface**: Seamless switching between Marathi and Hindi across all screens and prompts.
- **Single Primary Action Rule**: Every screen has one clear, prominent action to prevent cognitive overload.
- **Audio Capture & Waveform**: High-fidelity audio recorder with recording consent reminder, pause/resume, and duration timer.
- **Traceability Verification**: Extracted parameters are shown side-by-side with the verbatim transcript.

### B. Supervisory ANM Portal Subsystem
- **Triage Queue**: Sorts submissions by urgency (High-risk pregnancies and clinical danger signs elevated to top).
- **Split-Screen Evidence Inspector**: Displays verbatim transcript and audio on the left, structured clinical form on the right. Tapping a field highlights the exact words spoken.
- **Review Workflow**: Configurable approval authority allowing ANMs to verify records, add supervisor remarks, or return drafts to ASHAs for re-checking.

### C. Backend & AI Subsystem
- **Provider-Agnostic Speech Adapter**: Pluggable interface to Sarvam Saaras v3 with latency metrics, retry policies, and fallback transcript caching.
- **Deterministic Evidence Validator**: Verifies that every extracted value is backed by an exact substring in the original transcript; rejects hallucinated claims.
- **Independent Clinical Rules**: Rule-based alerts for elevated blood pressure ($\ge 140/90$ mmHg), severe gestational anemia ($< 7.0$ g/dL), and red-flag obstetric symptoms.
