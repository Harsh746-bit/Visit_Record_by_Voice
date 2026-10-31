# Testing Strategy & Quality Assurance — Visit Record by Voice

## 1. Testing Pyramid

```
       / \
      / E2E \       End-to-End Multilingual Encounter Tests (Marathi/Hindi)
     /-------\
    /  Integ  \     FastAPI API & ANM Review Workflow Integration Tests
   /-----------\
  /    Unit     \   Pydantic Schema, Deterministic Offsets, Clinical Rules
 /---------------\
```

---

## 2. Test Suites Overview

### A. Backend Unit & Integration Tests (`backend/test_api.py`)
- `test_health_check`: Verifies server status and component readiness.
- `test_list_beneficiaries`: Ensures synthetic patient directory retrieval.
- `test_list_visit_records`: Validates visit queue querying.
- `test_clinical_rule_elevated_bp_pre_eclampsia`: Tests deterministic clinical rule engine against dangerous BP ($140/95$) and pre-eclampsia triad symptoms.
- `test_clinical_rule_severe_anemia`: Verifies urgent referral trigger for hemoglobin $< 7.0$ g/dL.
- `test_anm_review_workflow`: Validates full review cycle (approval, return with remarks).

### B. Frontend Verification (`web/`)
- TypeScript compiler verification with zero type violations (`tsc -b`).
- Production Vite build verification (`npm run build`).
- Interactive evidence highlighting verification (word span matching in Marathi and Hindi).
- Responsive layout verification across desktop, tablet, and mobile viewports.

### C. Android Verification (`android/`)
- Jetpack Compose Material 3 preview rendering.
- StateFlow ViewModel unit tests.
- Room database offline caching and draft recovery.
- Android Audio recording lifecycle tests.

---

## 3. How to Execute Tests

### Backend Test Execution
```bash
python -m pytest backend/test_api.py -v
```

### Frontend Typecheck & Build Execution
```bash
cd web
npm run build
```
