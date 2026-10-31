# Visit Record by Voice (भेट नोंदणी आवाज)
### AI-Powered Multilingual Healthcare Documentation Platform for Frontline ASHA Workers & ANMs in Maharashtra, India

> **Core Principle**: *AI generates the record, evidence explains the record, and the healthcare worker makes the final decision.*

---

## 1. Executive Summary & Problem Context
Frontline healthcare workers (**ASHA workers** and **ANMs**) conduct home visits across rural and peri-urban Maharashtra to track pregnancies, maternal vitals, infant immunizations, and malnutrition.

Currently, documentation is fragmented across multiple physical registers (RCH register, ANC book, immunization logs). Frontline workers face typing fatigue, smartphone keyboard friction, and English terminology barriers.

**Visit Record by Voice** provides a human-centered, multilingual voice-documentation platform:
1. **Frontline ASHA Worker speaks naturally** in Marathi (मराठी) or Hindi (हिन्दी) describing the home visit.
2. **Sarvam Saaras Indic ASR** transcribes colloquial spoken speech with vernacular medical terms.
3. **Clinical LLM Extraction** maps spoken sentences into a strict Pydantic clinical schema.
4. **Signature Traceable Evidence Attribution**: Every single extracted vital (BP, Hb, Weight, Symptoms) is anchored to the exact character span in the raw transcript with highlighting. No hallucinated parameters are accepted.
5. **Independent Rule-based Clinical Validation**: Clinical alerts for pre-eclampsia (BP >= 140/90), severe anemia (Hb < 7.0 g/dL), and danger signs are triaged without automated prescription.
6. **Explicit Worker Sign-off**: No record is ever saved or synced without explicit ASHA confirmation.
7. **ANM Supervisory Portal**: Authorised ANMs inspect structured records, view the split evidence review alongside verbatim audio, and approve or return records with supervision notes.

---

## 2. Technology Stack

- **Web Dashboard**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts Analytics.
- **Frontline Mobile (Android)**: Kotlin, Jetpack Compose, Material 3, MVVM Architecture, Navigation Compose, Room Database, Android Audio APIs.
- **Backend API**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, Pytest.
- **AI / Speech Stack**: Sarvam Saaras v3indic speech-to-text adapter, structured JSON extraction with exact offset evidence spans.

---

## 3. UI/UX Design System Tokens

- **Brand Personality**: Trustworthy, Calm, Accessible, Modern, Professional.
- **Primary Teal**: `#087F8C`
- **Secondary Green**: `#15966A`
- **Main Background**: `#F7FAFA`
- **Card Background**: `#FFFFFF`
- **Primary Text**: `#172B3A`
- **Secondary Text**: `#718096`
- **Border / Dividers**: `#E4ECEC`
- **Warning Amber**: `#E8A23A`
- **Danger Red**: `#DC5B5B`
- **Success Green**: `#15966A`
- **Typography**: Inter (Latin) & Noto Sans Devanagari (Marathi / Hindi).

---

## 4. Project Structure

```
visit-record-by-voice/
├── web/                             # React + Vite + Tailwind Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── anm/                 # ANM Supervisor Portal Views
│   │   │   │   ├── AnmDashboardView.tsx      # KPIs, Recharts volume trends, High-risk alerts
│   │   │   │   ├── RecordDetailView.tsx      # Priority Split Screen Evidence Review
│   │   │   │   ├── VisitRecordsTable.tsx     # Filterable visit records queue
│   │   │   │   ├── WorkersListView.tsx       # ASHA workers circle directory
│   │   │   │   ├── ReportsAnalyticsView.tsx  # Indicators, language distribution, CSV export
│   │   │   │   └── AnmSettingsView.tsx       # RBAC & Sarvam Saaras configuration
│   │   │   ├── asha/                # Interactive Frontline ASHA Phone Simulator
│   │   │   │   └── AshaMobileSimulator.tsx   # All 15 mobile screens with live Marathi/Hindi toggle
│   │   │   └── common/
│   │   │       ├── Header.tsx                # Dual-view switcher, language toggle, user badge
│   │   │       ├── Badge.tsx                 # Status pills for clinical tags
│   │   │       └── EvidenceHighlighter.tsx   # Traceable transcript highlighter
│   │   ├── data/mockData.ts         # Realistic Pune & Nashik circle synthetic data
│   │   ├── types/index.ts           # TypeScript interfaces (Visit, EvidenceSpan, Warnings)
│   │   ├── App.tsx                  # Root application supporting ANM, ASHA & Dual View
│   │   └── index.css                # Custom healthcare palette & Devanagari styling
├── android/                         # Native Android Application (Kotlin + Jetpack Compose)
│   ├── app/
│   │   ├── src/main/java/com/visitrecord/app/
│   │   │   ├── MainActivity.kt               # Navigation host
│   │   │   ├── data/model/VisitModels.kt     # Kotlin data models
│   │   │   ├── ui/navigation/Screen.kt       # Navigation routes (15 screens)
│   │   │   ├── ui/screens/AshaScreens.kt     # Compose screens (Dashboard, Voice, Evidence)
│   │   │   └── ui/theme/                     # Theme, Color, Type tokens
│   │   ├── src/main/AndroidManifest.xml      # Audio recording & internet permissions
│   │   └── build.gradle.kts                  # Android Gradle build configuration
│   └── settings.gradle.kts
└── backend/                         # FastAPI Python Backend
    ├── app/
    │   ├── main.py                  # REST API endpoints (Auth, Visits, Audio, Reviews)
    │   ├── core/config.py           # Environment settings & API keys
    │   ├── schemas/visit.py         # Pydantic schemas for evidence spans & validation
    │   ├── services/clinical_rules.py # Independent rule-based clinical validation engine
    │   └── data/synthetic_data.py   # Realistic Marathi/Hindi clinical visit scenarios
    ├── requirements.txt
    └── test_api.py                  # Pytest test suite (6 passing unit tests)
```

---

## 5. How to Run

### 1. Web Dashboard & Interactive Mobile Simulator
```bash
cd web
npm run dev
```
Open `http://localhost:5173` in your browser.
- Use the top navigation bar to toggle between:
  - **ANM Supervisor Portal** (Desktop clinical oversight & approval)
  - **ASHA Mobile App** (Interactive smartphone simulation of all 15 screens in Marathi/Hindi)
  - **Live Dual-View** (Side-by-side split screen showing ASHA voice recording live on the right and ANM supervisory review queue on the left).

### 2. Python FastAPI Backend & Test Suite
```bash
# Run automated tests
python -m pytest backend/test_api.py -v

# Start FastAPI server
python -m uvicorn backend.app.main:app --reload --port 8000
```
Interactive OpenAPI documentation will be available at: `http://localhost:8000/docs`.

### 3. Native Android Project
Open the `android/` directory in Android Studio (Giraffe/Hedgehog/Iguana+) with Android SDK 35 and JDK 17/21.
