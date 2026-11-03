# Clinical Safety Protocols & Danger Sign Guidelines
**Visit Record by Voice (बोल. पडताळा. नोंदवा.)**
*Maharashtra National Health Mission (NHM) & Primary Healthcare Companion*

---

## 1. Core Clinical Safety Principle

> **"AI generates the record, evidence explains the record, and the healthcare worker makes the final decision."**

The **Visit Record by Voice** system is an AI-assisted documentation and review tool designed for Accredited Social Health Activists (ASHAs) and Auxiliary Nurse Midwives (ANMs) in Maharashtra. 

### Explicit Non-Diagnostic Boundaries
- **No Autonomous Diagnosis**: The system strictly **NEVER** issues medical diagnoses. It identifies clinical danger signs and flags records for qualified human clinician review.
- **No Automated Treatment Prescriptions**: The system **NEVER** suggests, prescribes, or adjusts drug dosages or therapies.
- **Traceable Evidence Spans**: Every clinical vital sign and risk indicator extracted by Indic speech and language models is bound to exact verbatim character offsets in the original audio transcript.
- **Mandatory Human-in-the-Loop Verification**: A visit record cannot be finalized or exported to official health registries without verified review and explicit digital sign-off by a qualified ANM or Medical Officer.

---

## 2. Standardized Danger Signs & Triage Rules

The clinical thresholds enforced in the verification pipeline adhere strictly to official government and global maternal-child health guidelines:

| Clinical Indicator | High-Risk Danger Sign Threshold | Clinical Rationale & Source Reference | System Action & Triage Level |
| :--- | :--- | :--- | :--- |
| **Blood Pressure / Hypertension** | **Systolic $\ge$ 140 mmHg**<br>OR<br>**Diastolic $\ge$ 90 mmHg** | **Gestational Hypertension / Pre-eclampsia Risk**<br>• *Source*: Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) & NHM Guidelines for Antenatal Care and Skilled Attendance at Birth.<br>• If accompanied by headache, visual blurring, or epigastric pain, indicates imminent pre-eclampsia. | **RED High-Risk Badge**<br>• WebSocket broadcast to ANM Supervisor (`high_risk.alert`)<br>• Immediate prompt: Recommend Sub-District Hospital (SDH) or Rural Hospital (RH) evaluation |
| **Severe Anemia** | **Hemoglobin < 7.0 g/dL** | **Severe Maternal Anemia**<br>• *Source*: Anemia Mukt Bharat (AMB) Operational Guidelines (MoHFW) & WHO Guidelines on Maternal Anemia.<br>• Poses immediate risks of maternal cardiac failure, preterm birth, and postpartum haemorrhage. | **RED High-Risk Badge**<br>• Immediate referral recommendation for First Referral Unit (FRU) parenteral iron / blood transfusion |
| **Moderate Anemia** | **7.0 $\le$ Hb < 11.0 g/dL** | **Mild-to-Moderate Anemia**<br>• *Source*: AMB / PMSMA protocols.<br>• Requires therapeutic oral Iron-Folic Acid (IFA) dietary counseling by ANM. | **AMBER Moderate-Risk Badge**<br>• Highlighted in ANM verification queue for IFA compliance check |
| **Absent Fetal Movement** | **Gestational Age > 24 weeks** with reported **absent or diminished fetal kicks** | **Intrauterine Fetal Distress Risk**<br>• *Source*: MoHFW Guidelines for Antenatal Care and Skilled Birth Attendance.<br>• Requires urgent fetal heart rate (FHR) Doppler / Non-Stress Test (NST) assessment. | **RED High-Risk Badge**<br>• Immediate urgent referral notification to 24x7 Primary Health Centre (PHC) or SDH |
| **Vaginal Bleeding** | **Any bleeding** at any gestational stage | **Antepartum Haemorrhage (APH) / Threatened Miscarriage**<br>• *Source*: Emergency Obstetric and Newborn Care (EmONC) Protocols, MoHFW.<br>• Non-deferrable obstetric emergency. | **RED High-Risk Badge**<br>• Immediate emergency transport alert prompt |

---

## 3. Referral Hospital Hierarchy (Maharashtra Public Health Context)

When danger signs are detected in a visit record, the system generates non-prescriptive, standardized institutional referral recommendations matched to the clinical urgency:

1. **Sub-Centre (SC) / Ayushman Arogya Mandir**:
   - First contact point for routine ANC, IFA distribution, maternal immunization (Td), and screening.
   - Handled by ASHA and Community Health Officer (CHO) / ANM.
2. **Primary Health Centre (PHC) - 24x7**:
   - Triage, routine normal delivery, primary emergency resuscitation.
   - Target for mild/moderate concerns or initial verification by Medical Officer (MBBS).
3. **Rural Hospital (RH) / Sub-District Hospital (SDH)**:
   - Secondary care facility equipped for managing hypertensive disorders of pregnancy, IV iron sucrose administration, and non-stress testing.
   - Primary referral destination for confirmed high-risk ANC visits.
4. **District Hospital (DH) / Government Medical College (GMC)**:
   - Comprehensive Emergency Obstetric and Newborn Care (CEmONC) centre.
   - Equipped for emergency Caesarean sections, blood bank facilities, and adult/neonatal intensive care (ICU/NICU).

---

## 4. Evidence Span Traceability & Verification Workflow

To guarantee zero hallucination and complete accountability:

```
[ Spoken Marathi / Hindi Audio ]
              │
              ▼
[ Sarvam Saaras v3 ASR Adapter ] ──► Verbatim Indic Transcript
              │
              ▼
[ Pydantic Schema + Regex Engine ] ──► Clinical Entities Extracted
              │
              ├──► Character Offsets: start_char, end_char
              ├──► Extracted Numeric Values: e.g. 140/95 mmHg, 54.0 kg
              └──► Confidence Metric: 0.00 – 1.00
              │
              ▼
[ Clinical Risk Evaluator ]
       │
       ├──► Normal Parameters ──► Standard ANM Queue (Routine Review)
       │
       └──► Danger Signs Met   ──► RED Alert + Immediate Supervisor WebSocket Dispatch
              │
              ▼
[ Qualified Clinician Interface (ANM Dashboard) ]
       │
       ├──► Side-by-side Evidence Inspector (Source Text vs Extracted Value)
       ├──► Clinical Decision: APPROVE / RETURN FOR CORRECTION / ESCALATE
       └──► Official Health Registry Export (Only upon human sign-off)
```

---

## 5. References & Regulatory Authority

1. **Ministry of Health and Family Welfare (MoHFW), Government of India**:
   - *Guidelines for Antenatal Care and Skilled Attendance at Birth by ANMs and LHVs.*
   - *Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) Clinical Guidelines.*
2. **Anemia Mukt Bharat (AMB)**:
   - *Operational Guidelines for Intensified National Iron Plus Initiative (I-NIPI).*
3. **National Health Mission (NHM), Public Health Department, Maharashtra**:
   - *Standard Operating Procedures for ASHA and ANM Village Health Sanitation and Nutrition Committees (VHSNC).*
4. **World Health Organization (WHO)**:
   - *WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience (2016).*
   - *WHO Guidelines on the Management of Severe and Moderate Malnutrition & Maternal Hypertension.*
