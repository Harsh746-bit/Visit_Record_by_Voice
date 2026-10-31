from datetime import datetime, timedelta

SYNTHETIC_BENEFICIARIES = [
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
        "lmp_date": "2026-04-15",
        "edd_date": "2027-01-22",
        "high_risk": True,
        "high_risk_reasons": ["Previous C-section", "Borderline hypertension"],
        "assigned_asha_id": "ASHA-PUN-104",
        "assigned_asha_name": "Rukmini Vithal Jadhav",
        "contact_phone": "+91 98221 45012",
        "rch_id": "MH-27-04-2026-0912"
    },
    {
        "id": "BEN-MH-PUN-0842",
        "name": "Pooja Rahul Patil",
        "name_mr": "पूजा राहुल पाटील",
        "age": 21,
        "village": "Wadgaon Budruk, Pune",
        "sub_center": "Dhayari Sub-Center",
        "phc": "Narhe PHC",
        "category": "Pregnant Woman (ANC)",
        "gravida": 1,
        "parity": 0,
        "gestational_weeks": 16,
        "lmp_date": "2026-07-08",
        "edd_date": "2027-04-15",
        "high_risk": False,
        "high_risk_reasons": [],
        "assigned_asha_id": "ASHA-PUN-104",
        "assigned_asha_name": "Rukmini Vithal Jadhav",
        "contact_phone": "+91 97632 88419",
        "rch_id": "MH-27-04-2026-1184"
    },
    {
        "id": "BEN-MH-NSK-0512",
        "name": "Kavita Ramesh Gaikwad",
        "name_mr": "कविता रमेश गायकवाड",
        "age": 27,
        "village": "Trimbakeshwar Rural, Nashik",
        "sub_center": "Anjaneri Sub-Center",
        "phc": "Trimbak PHC",
        "category": "Pregnant Woman (ANC)",
        "gravida": 3,
        "parity": 2,
        "gestational_weeks": 34,
        "lmp_date": "2026-03-02",
        "edd_date": "2026-12-09",
        "high_risk": True,
        "high_risk_reasons": ["Severe Anemia (Hb 7.8 g/dL)", "Pedal Edema"],
        "assigned_asha_id": "ASHA-NSK-201",
        "assigned_asha_name": "Surekha Dattatray Bhor",
        "contact_phone": "+91 94231 67204",
        "rch_id": "MH-20-03-2026-4431"
    },
    {
        "id": "BEN-MH-PUN-0845",
        "name": "Anjali Sachin More",
        "name_mr": "अंजली सचिन मोरे",
        "age": 22,
        "village": "Saswad Rural, Pune",
        "sub_center": "Saswad Sub-Center",
        "phc": "Saswad Rural Hospital",
        "category": "Lactating Mother (PNC)",
        "gravida": 1,
        "parity": 1,
        "delivery_date": "2026-10-12",
        "infant_name": "Aarav More",
        "infant_gender": "Male",
        "infant_weight_birth": 2.8,
        "high_risk": False,
        "high_risk_reasons": [],
        "assigned_asha_id": "ASHA-PUN-104",
        "assigned_asha_name": "Rukmini Vithal Jadhav",
        "contact_phone": "+91 99214 30911",
        "rch_id": "MH-27-04-2026-2005"
    }
]

SYNTHETIC_WORKERS = [
    {
        "id": "ASHA-PUN-104",
        "name": "Rukmini Vithal Jadhav",
        "role": "ASHA Worker",
        "assigned_area": "Khed Shivapur Circle, Pune",
        "village_covered": ["Khed Shivapur", "Kondhanpur"],
        "assigned_anm_name": "Sujata Deshmukh (ANM)",
        "phone": "+91 98810 99401",
        "today_visits": 8,
        "completed_today": 5,
        "pending_drafts": 3,
        "submitted_month": 42
    },
    {
        "id": "ASHA-NSK-201",
        "name": "Surekha Dattatray Bhor",
        "role": "ASHA Worker",
        "assigned_area": "Trimbakeshwar Rural, Nashik",
        "village_covered": ["Anjaneri", "Torangan"],
        "assigned_anm_name": "Mangala Sonawane (ANM)",
        "phone": "+91 94200 33118",
        "today_visits": 6,
        "completed_today": 4,
        "pending_drafts": 2,
        "submitted_month": 38
    }
]

# Realistic Spoken Encounter Samples with Exact Word Ranges for Traceable Evidence
DEMO_VISIT_SCENARIOS = {
    "marathi_anc_high_risk": {
        "title": "Sunita Shinde — ANC Visit (Marathi - High Risk BP)",
        "language": "mr-IN",
        "beneficiary_id": "BEN-MH-PUN-0841",
        "asha_id": "ASHA-PUN-104",
        "transcript": (
            "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. "
            "सुनिताचे वय २४ वर्षे असून ती सध्या २८ आठवड्यांची गरोदर आहे. "
            "तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे. "
            "वजन ५४ किलो आहे. हिमोग्लोबिन १०.२ ग्रॅम भरले. "
            "तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे. "
            "बाळाची हालचाल व्यवस्थित आहे. "
            "मी तिला तातडीने प्राथमिक आरोग्य केंद्रात डॉक्टरांकडे जाण्यास सांगितले आणि आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला."
        ),
        "evidence_spans": [
            {
                "field_name": "gestational_age_weeks",
                "extracted_value": 28,
                "start_char": 95,
                "end_char": 105,
                "source_text": "२८ आठवड्यांची",
                "confidence": 0.98,
                "status": "extracted"
            },
            {
                "field_name": "blood_pressure_systolic",
                "extracted_value": 140,
                "start_char": 145,
                "end_char": 154,
                "source_text": "बीपी १४०/९५",
                "confidence": 0.99,
                "status": "concerning"
            },
            {
                "field_name": "blood_pressure_diastolic",
                "extracted_value": 95,
                "start_char": 145,
                "end_char": 154,
                "source_text": "बीपी १४०/९५",
                "confidence": 0.99,
                "status": "concerning"
            },
            {
                "field_name": "weight_kg",
                "extracted_value": 54.0,
                "start_char": 172,
                "end_char": 184,
                "source_text": "वजन ५४ किलो आहे",
                "confidence": 0.96,
                "status": "extracted"
            },
            {
                "field_name": "hemoglobin_g_dl",
                "extracted_value": 10.2,
                "start_char": 186,
                "end_char": 210,
                "source_text": "हिमोग्लोबिन १०.२ ग्रॅम भरले",
                "confidence": 0.97,
                "status": "extracted"
            },
            {
                "field_name": "headache_or_blurred_vision",
                "extracted_value": True,
                "start_char": 212,
                "end_char": 260,
                "source_text": "तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे",
                "confidence": 0.95,
                "status": "concerning"
            },
            {
                "field_name": "swelling_pedal_edema",
                "extracted_value": True,
                "start_char": 266,
                "end_char": 283,
                "source_text": "पायावर हलकी सूज आहे",
                "confidence": 0.93,
                "status": "concerning"
            },
            {
                "field_name": "fetal_movement_normal",
                "extracted_value": True,
                "start_char": 285,
                "end_char": 312,
                "source_text": "बाळाची हालचाल व्यवस्थित आहे",
                "confidence": 0.97,
                "status": "extracted"
            },
            {
                "field_name": "ifa_tablets_given",
                "extracted_value": True,
                "start_char": 376,
                "end_char": 425,
                "source_text": "आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला",
                "confidence": 0.92,
                "status": "extracted"
            }
        ]
    },
    "hindi_anc_routine": {
        "title": "Pooja Patil — Routine ANC Visit (Hindi - Normal)",
        "language": "hi-IN",
        "beneficiary_id": "BEN-MH-PUN-0842",
        "asha_id": "ASHA-PUN-104",
        "transcript": (
            "आज मैंने पूजा राहुल पाटिल के घर विजिट किया। पूजा की उम्र 21 साल है और वह पहली बार गर्भवती है, "
            "अभी उसका 16वां हफ्ता चल रहा है। "
            "उसका बीपी 118/76 नॉर्मल आया है। वजन 49 किलो है और हीमोग्लोबिन 11.5 ग्राम है। "
            "उसे कोई उल्टी, चक्कर या सिरदर्द की शिकायत नहीं है। "
            "मैंने उसे 30 दिन की आयरन और कैल्शियम की गोलियां दी हैं और हरी पत्तेदार सब्जियां खाने की सलाह दी।"
        ),
        "evidence_spans": [
            {
                "field_name": "gestational_age_weeks",
                "extracted_value": 16,
                "start_char": 83,
                "end_char": 94,
                "source_text": "16वां हफ्ता",
                "confidence": 0.98,
                "status": "extracted"
            },
            {
                "field_name": "blood_pressure_systolic",
                "extracted_value": 118,
                "start_char": 117,
                "end_char": 128,
                "source_text": "बीपी 118/76",
                "confidence": 0.99,
                "status": "extracted"
            },
            {
                "field_name": "blood_pressure_diastolic",
                "extracted_value": 76,
                "start_char": 117,
                "end_char": 128,
                "source_text": "बीपी 118/76",
                "confidence": 0.99,
                "status": "extracted"
            },
            {
                "field_name": "weight_kg",
                "extracted_value": 49.0,
                "start_char": 144,
                "end_char": 156,
                "source_text": "वजन 49 किलो है",
                "confidence": 0.96,
                "status": "extracted"
            },
            {
                "field_name": "hemoglobin_g_dl",
                "extracted_value": 11.5,
                "start_char": 161,
                "end_char": 184,
                "source_text": "हीमोग्लोबिन 11.5 ग्राम है",
                "confidence": 0.97,
                "status": "extracted"
            },
            {
                "field_name": "headache_or_blurred_vision",
                "extracted_value": False,
                "start_char": 186,
                "end_char": 234,
                "source_text": "उसे कोई उल्टी, चक्कर या सिरदर्द की शिकायत नहीं है",
                "confidence": 0.95,
                "status": "extracted"
            },
            {
                "field_name": "ifa_tablets_given",
                "extracted_value": True,
                "start_char": 236,
                "end_char": 283,
                "source_text": "मैंने उसे 30 दिन की आयरन और कैल्शियम की गोलियां दी हैं",
                "confidence": 0.98,
                "status": "extracted"
            }
        ]
    }
}
