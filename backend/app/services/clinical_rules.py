from typing import List, Dict, Any, Optional
from backend.app.schemas.visit import StructuredVisitRecord, ValidationSeverity

class ClinicalRuleValidator:
    """
    Rule-based clinical validation for frontline maternal & child health visit records.
    Maintained strictly independent from the LLM extraction logic.
    Identifies:
      - Missing critical fields
      - Physiologically abnormal or invalid measurements
      - Contradictory observations
      - Red-flag danger signs explicitly documented in the encounter
    Note: NEVER generates medical diagnoses or prescription treatments.
    """

    @classmethod
    def validate_record(cls, record: StructuredVisitRecord) -> List[Dict[str, Any]]:
        warnings: List[Dict[str, Any]] = []

        m = record.measurements
        p = record.pregnancy_details
        s = record.symptoms

        # 1. Blood Pressure Validation
        sbp = m.blood_pressure_systolic.value
        dbp = m.blood_pressure_diastolic.value

        if sbp is not None and dbp is not None:
            try:
                sbp_val = float(sbp)
                dbp_val = float(dbp)

                if sbp_val <= dbp_val:
                    warnings.append({
                        "field": "blood_pressure",
                        "severity": ValidationSeverity.WARNING.value,
                        "code": "BP_INVERTED",
                        "message_en": "Systolic BP is less than or equal to Diastolic BP. Please verify reading.",
                        "message_mr": "सिस्टॉलिक रक्तदाब डायस्टॉलिकपेक्षा कमी किंवा समान आहे. कृपया पुन्हा तपासा.",
                        "message_hi": "सिस्टोलिक बीपी डायस्टोलिक से कम या बराबर है। कृपया पुनः जांचें।",
                        "supporting_phrase": m.blood_pressure_systolic.supporting_phrase or m.blood_pressure_diastolic.supporting_phrase
                    })

                # High Blood Pressure / Pre-eclampsia danger sign
                if sbp_val >= 140 or dbp_val >= 90:
                    warnings.append({
                        "field": "blood_pressure",
                        "severity": ValidationSeverity.CRITICAL.value,
                        "code": "ELEVATED_BP_DANGER_SIGN",
                        "message_en": f"Blood Pressure ({int(sbp_val)}/{int(dbp_val)} mmHg) is significantly elevated (>= 140/90). Requires urgent ANM review & MO consultation.",
                        "message_mr": f"रक्तदाब ({int(sbp_val)}/{int(dbp_val)} mmHg) जास्त आहे (>= १४०/९०). तातडीने ANM व वैद्यकीय अधिकाऱ्यांशी संपर्क साधावा.",
                        "message_hi": f"रक्तचाप ({int(sbp_val)}/{int(dbp_val)} mmHg) सामान्यपेक्षा अधिक है (>= 140/90)। तत्काल एएनएम समीक्षा आवश्यक है।",
                        "supporting_phrase": m.blood_pressure_systolic.supporting_phrase
                    })
            except (ValueError, TypeError):
                pass
        else:
            warnings.append({
                "field": "blood_pressure",
                "severity": ValidationSeverity.WARNING.value,
                "code": "BP_MISSING",
                "message_en": "Blood Pressure measurement was not mentioned or recorded.",
                "message_mr": "रक्तदाब नोंदवला गेलेला नाही किंवा आवाजात उल्लेख नाही.",
                "message_hi": "रक्तचाप रिकॉर्ड नहीं किया गया है।",
                "supporting_phrase": None
            })

        # 2. Hemoglobin (Hb) Validation
        hb = m.hemoglobin_g_dl.value
        if hb is not None:
            try:
                hb_val = float(hb)
                if hb_val < 7.0:
                    warnings.append({
                        "field": "hemoglobin_g_dl",
                        "severity": ValidationSeverity.CRITICAL.value,
                        "code": "SEVERE_ANEMIA_DANGER",
                        "message_en": f"Hemoglobin level is critically low ({hb_val} g/dL, < 7.0 g/dL). Severe anemia requires immediate hospital referral.",
                        "message_mr": f"हिमोग्लोबिनचे प्रमाण अत्यंत कमी आहे ({hb_val} g/dL, < ७.०). गंभीर अशक्तपणा असल्याने त्वरित रुग्णालयात पाठवावे.",
                        "message_hi": f"हीमोग्लोबिन स्तर अत्यंत कम है ({hb_val} g/dL)। तुरंत अस्पताल रेफरल की आवश्यकता है।",
                        "supporting_phrase": m.hemoglobin_g_dl.supporting_phrase
                    })
                elif hb_val < 11.0:
                    warnings.append({
                        "field": "hemoglobin_g_dl",
                        "severity": ValidationSeverity.INFO.value,
                        "code": "MILD_MODERATE_ANEMIA",
                        "message_en": f"Hemoglobin ({hb_val} g/dL) indicates mild to moderate anemia (< 11.0 g/dL). Monitor IFA tablet adherence.",
                        "message_mr": f"हिमोग्लोबिन ({hb_val} g/dL) कमी आहे. आयर्नच्या गोळ्यांचे (IFA) नियमित सेवन सुनिश्चित करा.",
                        "message_hi": f"हीमोग्लोबिन ({hb_val} g/dL) कम है। आयरन की गोलियों (IFA) का नियमित सेवन कराएं।",
                        "supporting_phrase": m.hemoglobin_g_dl.supporting_phrase
                    })
            except (ValueError, TypeError):
                pass

        # 3. Explicit Obstetric Danger Signs from Symptoms
        if s.bleeding_or_spotting.value is True:
            warnings.append({
                "field": "bleeding_or_spotting",
                "severity": ValidationSeverity.CRITICAL.value,
                "code": "DANGER_VAGINAL_BLEEDING",
                "message_en": "Vaginal bleeding or spotting reported during pregnancy. Immediate emergency referral required.",
                "message_mr": "गर्भधारणेदरम्यान रक्तस्राव झाल्याची नोंद आहे. त्वरित प्राथमिक आरोग्य केंद्रात (PHC) पाठवा.",
                "message_hi": "गर्भावस्था के दौरान रक्तस्राव की सूचना है। तुरंत स्वास्थ्य केंद्र भेजें।",
                "supporting_phrase": s.bleeding_or_spotting.supporting_phrase
            })

        if s.fetal_movement_normal.value is False:
            warnings.append({
                "field": "fetal_movement_normal",
                "severity": ValidationSeverity.CRITICAL.value,
                "code": "DANGER_REDUCED_FETAL_MOVEMENT",
                "message_en": "Decreased or absent fetal movements reported. Urgent fetal viability check required.",
                "message_mr": "बाळाची हालचाल कमी किंवा जाणवत नसल्याची नोंद आहे. त्वरित तपासणी आवश्यक आहे.",
                "message_hi": "शिशु की हलचल कम होने की सूचना है। तुरंत जांच कराएं।",
                "supporting_phrase": s.fetal_movement_normal.supporting_phrase
            })

        if s.headache_or_blurred_vision.value is True and sbp and float(sbp or 0) >= 140:
            warnings.append({
                "field": "headache_or_blurred_vision",
                "severity": ValidationSeverity.CRITICAL.value,
                "code": "PRE_ECLAMPSIA_TRIAD",
                "message_en": "Severe headache/blurred vision combined with elevated BP indicates high risk of pre-eclampsia.",
                "message_mr": "डोकेदुखी/अंधुक दिसणे आणि जास्त रक्तदाब ही प्री-एक्लॅम्पसियाची गंभीर लक्षणे आहेत.",
                "message_hi": "सिरदर्द/धुंधला दिखना और उच्च रक्तचाप प्री-एक्लेम्पसिया का संकेत हो सकता है।",
                "supporting_phrase": s.headache_or_blurred_vision.supporting_phrase
            })

        # 4. Missing Core Fields Check
        if p.gestational_age_weeks.value is None:
            warnings.append({
                "field": "gestational_age_weeks",
                "severity": ValidationSeverity.INFO.value,
                "code": "GESTATIONAL_AGE_UNSPECIFIED",
                "message_en": "Gestational age in weeks was not mentioned in the voice note.",
                "message_mr": "गरोदरपणाचे आठवडे आवाजात सांगितलेले नाहीत.",
                "message_hi": "गर्भ के सप्ताह का उल्लेख नहीं है।",
                "supporting_phrase": None
            })

        return warnings
