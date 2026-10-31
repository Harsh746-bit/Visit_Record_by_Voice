import { Beneficiary, AshaWorker, StructuredVisit } from '../types';

export const MOCK_WORKERS: AshaWorker[] = [
  {
    id: "ASHA-PUN-104",
    name: "Rukmini Vithal Jadhav",
    role: "ASHA Worker",
    assignedArea: "Khed Shivapur Circle, Pune",
    district: "Pune",
    phc: "Khed PHC",
    subCenter: "Shivapur Sub-Center",
    villageCovered: ["Khed Shivapur", "Kondhanpur"],
    assignedAnmName: "Sujata Deshmukh (ANM)",
    phone: "+91 98810 99401",
    todayVisits: 8,
    completedToday: 5,
    pendingDrafts: 3,
    submittedMonth: 42,
    status: "active"
  },
  {
    id: "ASHA-NSK-201",
    name: "Surekha Dattatray Bhor",
    role: "ASHA Worker",
    assignedArea: "Trimbakeshwar Rural, Nashik",
    district: "Nashik",
    phc: "Trimbak PHC",
    subCenter: "Anjaneri Sub-Center",
    villageCovered: ["Anjaneri", "Torangan"],
    assignedAnmName: "Mangala Sonawane (ANM)",
    phone: "+91 94200 33118",
    todayVisits: 6,
    completedToday: 4,
    pendingDrafts: 2,
    submittedMonth: 38,
    status: "active"
  },
  {
    id: "ASHA-PUN-108",
    name: "Sunanda Pandurang Shinde",
    role: "ASHA Worker",
    assignedArea: "Saswad Circle, Pune",
    district: "Pune",
    phc: "Saswad Rural Hospital",
    subCenter: "Saswad Sub-Center",
    villageCovered: ["Saswad Rural", "Bhor Phata"],
    assignedAnmName: "Sujata Deshmukh (ANM)",
    phone: "+91 97632 11099",
    todayVisits: 7,
    completedToday: 6,
    pendingDrafts: 1,
    submittedMonth: 45,
    status: "active"
  }
];

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    id: "BEN-MH-PUN-0841",
    name: "Sunita Sanjay Shinde",
    nameMr: "सुनिता संजय शिंदे",
    age: 24,
    village: "Khed Shivapur, Pune",
    subCenter: "Shivapur Sub-Center",
    phc: "Khed PHC",
    category: "Pregnant Woman (ANC - Trimester 3)",
    gravida: 2,
    parity: 1,
    gestationalWeeks: 28,
    lmpDate: "2026-04-15",
    eddDate: "2027-01-22",
    highRisk: true,
    highRiskReasons: ["Previous C-section", "High Blood Pressure (>140/90)", "Pre-eclampsia danger sign"],
    assignedAshaId: "ASHA-PUN-104",
    assignedAshaName: "Rukmini Vithal Jadhav",
    contactPhone: "+91 98221 45012",
    rchId: "MH-27-04-2026-0912",
    lastVisitDate: "2026-10-31"
  },
  {
    id: "BEN-MH-PUN-0842",
    name: "Pooja Rahul Patil",
    nameMr: "पूजा राहुल पाटील",
    age: 21,
    village: "Wadgaon Budruk, Pune",
    subCenter: "Dhayari Sub-Center",
    phc: "Narhe PHC",
    category: "Pregnant Woman (ANC - Trimester 2)",
    gravida: 1,
    parity: 0,
    gestationalWeeks: 16,
    lmpDate: "2026-07-08",
    eddDate: "2027-04-15",
    highRisk: false,
    highRiskReasons: [],
    assignedAshaId: "ASHA-PUN-104",
    assignedAshaName: "Rukmini Vithal Jadhav",
    contactPhone: "+91 97632 88419",
    rchId: "MH-27-04-2026-1184",
    lastVisitDate: "2026-10-30"
  },
  {
    id: "BEN-MH-NSK-0512",
    name: "Kavita Ramesh Gaikwad",
    nameMr: "कविता रमेश गायकवाड",
    age: 27,
    village: "Trimbakeshwar Rural, Nashik",
    subCenter: "Anjaneri Sub-Center",
    phc: "Trimbak PHC",
    category: "Pregnant Woman (ANC - Trimester 3)",
    gravida: 3,
    parity: 2,
    gestationalWeeks: 34,
    lmpDate: "2026-03-02",
    eddDate: "2026-12-09",
    highRisk: true,
    highRiskReasons: ["Severe Anemia (Hb 7.8 g/dL)", "Pedal Edema"],
    assignedAshaId: "ASHA-NSK-201",
    assignedAshaName: "Surekha Dattatray Bhor",
    contactPhone: "+91 94231 67204",
    rchId: "MH-20-03-2026-4431",
    lastVisitDate: "2026-10-29"
  },
  {
    id: "BEN-MH-PUN-0845",
    name: "Anjali Sachin More",
    nameMr: "अंजली सचिन मोरे",
    age: 22,
    village: "Saswad Rural, Pune",
    subCenter: "Saswad Sub-Center",
    phc: "Saswad Rural Hospital",
    category: "Lactating Mother (PNC)",
    gravida: 1,
    parity: 1,
    highRisk: false,
    highRiskReasons: [],
    assignedAshaId: "ASHA-PUN-104",
    assignedAshaName: "Rukmini Vithal Jadhav",
    contactPhone: "+91 99214 30911",
    rchId: "MH-27-04-2026-2005",
    lastVisitDate: "2026-10-28"
  }
];

export const MOCK_VISIT_RECORDS: StructuredVisit[] = [
  {
    recordId: "REC-2026-PUN-0914",
    beneficiaryId: "BEN-MH-PUN-0841",
    beneficiaryName: "Sunita Sanjay Shinde",
    ashaId: "ASHA-PUN-104",
    ashaName: "Rukmini Vithal Jadhav",
    language: "mr-IN",
    transcript: "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. सुनिताचे वय २४ वर्षे असून ती सध्या २८ आठवड्यांची गरोदर आहे. तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे. वजन ५४ किलो आहे. हिमोग्लोबिन १०.२ ग्रॅम भरले. तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे. बाळाची हालचाल व्यवस्थित आहे. मी तिला तातडीने प्राथमिक आरोग्य केंद्रात डॉक्टरांकडे जाण्यास सांगितले आणि आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला.",
    audioDurationSeconds: 44.2,
    recordedAt: "2026-10-31T10:15:00Z",
    visitType: "ANC",
    isConfirmedByAsha: true,
    confirmedAt: "2026-10-31T10:22:00Z",
    anmReviewStatus: "pending",
    anmReviewNotes: "Urgent medical officer review needed due to elevated BP (140/95) with headache.",
    measurements: {
      bloodPressureSystolic: {
        value: 140,
        unit: "mmHg",
        supportingPhrase: "बीपी १४०/९५",
        status: "concerning",
        confidence: 0.99,
        charRange: [145, 154],
        isVerified: true
      },
      bloodPressureDiastolic: {
        value: 95,
        unit: "mmHg",
        supportingPhrase: "बीपी १४०/९५",
        status: "concerning",
        confidence: 0.99,
        charRange: [145, 154],
        isVerified: true
      },
      weightKg: {
        value: 54.0,
        unit: "kg",
        supportingPhrase: "वजन ५४ किलो आहे",
        status: "extracted",
        confidence: 0.96,
        charRange: [172, 184],
        isVerified: true
      },
      hemoglobinGDl: {
        value: 10.2,
        unit: "g/dL",
        supportingPhrase: "हिमोग्लोबिन १०.२ ग्रॅम भरले",
        status: "extracted",
        confidence: 0.97,
        charRange: [186, 210],
        isVerified: true
      }
    },
    pregnancyDetails: {
      gestationalAgeWeeks: {
        value: 28,
        unit: "weeks",
        supportingPhrase: "२८ आठवड्यांची",
        status: "extracted",
        confidence: 0.98,
        charRange: [95, 105],
        isVerified: true
      },
      trimester: {
        value: 3,
        status: "extracted",
        confidence: 0.95
      },
      highRiskPregnancy: {
        value: true,
        status: "concerning",
        confidence: 0.94
      }
    },
    symptoms: {
      fever: {
        value: false,
        status: "extracted"
      },
      headacheOrBlurredVision: {
        value: true,
        supportingPhrase: "गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे",
        status: "concerning",
        confidence: 0.95,
        charRange: [216, 260],
        isVerified: true
      },
      swellingPedalEdema: {
        value: true,
        supportingPhrase: "पायावर हलकी सूज आहे",
        status: "concerning",
        confidence: 0.93,
        charRange: [266, 283],
        isVerified: true
      },
      bleedingOrSpotting: {
        value: false,
        status: "extracted"
      },
      fetalMovementNormal: {
        value: true,
        supportingPhrase: "बाळाची हालचाल व्यवस्थित आहे",
        status: "extracted",
        confidence: 0.97,
        charRange: [285, 312],
        isVerified: true
      }
    },
    interventions: {
      ifaTabletsGiven: {
        value: true,
        supportingPhrase: "आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला",
        status: "extracted",
        confidence: 0.92,
        charRange: [376, 425]
      },
      calciumTabletsGiven: {
        value: true,
        status: "extracted"
      },
      referralRecommended: {
        value: true,
        supportingPhrase: "तातडीने प्राथमिक आरोग्य केंद्रात डॉक्टरांकडे जाण्यास सांगितले",
        status: "concerning",
        confidence: 0.96,
        charRange: [315, 373]
      },
      referralFacility: {
        value: "Khed PHC / Sub-District Hospital",
        status: "extracted"
      }
    },
    evidenceSpans: [
      {
        fieldName: "gestationalAgeWeeks",
        extractedValue: 28,
        startChar: 95,
        endChar: 105,
        sourceText: "२८ आठवड्यांची",
        confidence: 0.98,
        status: "extracted"
      },
      {
        fieldName: "bloodPressureSystolic",
        extractedValue: 140,
        startChar: 145,
        endChar: 154,
        sourceText: "बीपी १४०/९५",
        confidence: 0.99,
        status: "concerning"
      },
      {
        fieldName: "bloodPressureDiastolic",
        extractedValue: 95,
        startChar: 145,
        endChar: 154,
        sourceText: "बीपी १४०/९५",
        confidence: 0.99,
        status: "concerning"
      },
      {
        fieldName: "weightKg",
        extractedValue: 54.0,
        startChar: 172,
        endChar: 184,
        sourceText: "वजन ५४ किलो आहे",
        confidence: 0.96,
        status: "extracted"
      },
      {
        fieldName: "hemoglobinGDl",
        extractedValue: 10.2,
        startChar: 186,
        endChar: 210,
        sourceText: "हिमोग्लोबिन १०.२ ग्रॅम भरले",
        confidence: 0.97,
        status: "extracted"
      },
      {
        fieldName: "headacheOrBlurredVision",
        extractedValue: true,
        startChar: 216,
        endChar: 260,
        sourceText: "गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे",
        confidence: 0.95,
        status: "concerning"
      },
      {
        fieldName: "swellingPedalEdema",
        extractedValue: true,
        startChar: 266,
        endChar: 283,
        sourceText: "पायावर हलकी सूज आहे",
        confidence: 0.93,
        status: "concerning"
      },
      {
        fieldName: "fetalMovementNormal",
        extractedValue: true,
        startChar: 285,
        endChar: 312,
        sourceText: "बाळाची हालचाल व्यवस्थित आहे",
        confidence: 0.97,
        status: "extracted"
      }
    ],
    validationWarnings: [
      {
        field: "bloodPressure",
        severity: "critical",
        code: "ELEVATED_BP_DANGER_SIGN",
        messageEn: "Blood Pressure (140/95 mmHg) is elevated (>= 140/90). Requires urgent ANM review & MO consultation.",
        messageMr: "रक्तदाब (१४०/९५ mmHg) जास्त आहे (>= १४०/९०). तातडीने ANM व वैद्यकीय अधिकाऱ्यांशी संपर्क साधावा.",
        messageHi: "रक्तचाप (140/95 mmHg) सामान्य से अधिक है। तत्काल एएनएम समीक्षा आवश्यक है।",
        supportingPhrase: "बीपी १४०/९५"
      },
      {
        field: "headacheOrBlurredVision",
        severity: "critical",
        code: "PRE_ECLAMPSIA_TRIAD",
        messageEn: "Persistent headache combined with elevated BP indicates high risk of pre-eclampsia.",
        messageMr: "डोकेदुखी आणि जास्त रक्तदाब ही प्री-एक्लॅम्पसियाची गंभीर लक्षणे असू शकतात.",
        messageHi: "सिरदर्द और उच्च रक्तचाप प्री-एक्लेम्पसिया का संकेत हो सकता है।",
        supportingPhrase: "गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे"
      }
    ]
  },
  {
    recordId: "REC-2026-PUN-0882",
    beneficiaryId: "BEN-MH-PUN-0842",
    beneficiaryName: "Pooja Rahul Patil",
    ashaId: "ASHA-PUN-104",
    ashaName: "Rukmini Vithal Jadhav",
    language: "hi-IN",
    transcript: "आज मैंने पूजा राहुल पाटिल के घर विजिट किया। पूजा की उम्र 21 साल है और वह पहली बार गर्भवती है, अभी उसका 16वां हफ्ता चल रहा है। उसका बीपी 118/76 नॉर्मल आया है। वजन 49 किलो है और हीमोग्लोबिन 11.5 ग्राम है। उसे कोई उल्टी, चक्कर या सिरदर्द की शिकायत नहीं है। मैंने उसे 30 दिन की आयरन और कैल्शियम की गोलियां दी हैं और हरी पत्तेदार सब्जियां खाने की सलाह दी।",
    audioDurationSeconds: 38.0,
    recordedAt: "2026-10-30T14:40:00Z",
    visitType: "ANC",
    isConfirmedByAsha: true,
    confirmedAt: "2026-10-30T14:45:00Z",
    anmReviewStatus: "reviewed",
    anmReviewNotes: "Routine ANC checkup in order. Normal vital parameters.",
    measurements: {
      bloodPressureSystolic: {
        value: 118,
        unit: "mmHg",
        supportingPhrase: "बीपी 118/76",
        status: "extracted",
        confidence: 0.99,
        charRange: [117, 128],
        isVerified: true
      },
      bloodPressureDiastolic: {
        value: 76,
        unit: "mmHg",
        supportingPhrase: "बीपी 118/76",
        status: "extracted",
        confidence: 0.99,
        charRange: [117, 128],
        isVerified: true
      },
      weightKg: {
        value: 49.0,
        unit: "kg",
        supportingPhrase: "वजन 49 किलो है",
        status: "extracted",
        confidence: 0.96,
        charRange: [144, 156],
        isVerified: true
      },
      hemoglobinGDl: {
        value: 11.5,
        unit: "g/dL",
        supportingPhrase: "हीमोग्लोबिन 11.5 ग्राम है",
        status: "extracted",
        confidence: 0.97,
        charRange: [161, 184],
        isVerified: true
      }
    },
    pregnancyDetails: {
      gestationalAgeWeeks: {
        value: 16,
        unit: "weeks",
        supportingPhrase: "16वां हफ्ता",
        status: "extracted",
        confidence: 0.98,
        charRange: [83, 94],
        isVerified: true
      },
      trimester: {
        value: 2,
        status: "extracted",
        confidence: 0.96
      },
      highRiskPregnancy: {
        value: false,
        status: "extracted",
        confidence: 0.98
      }
    },
    symptoms: {
      fever: {
        value: false,
        status: "extracted"
      },
      headacheOrBlurredVision: {
        value: false,
        supportingPhrase: "उसे कोई उल्टी, चक्कर या सिरदर्द की शिकायत नहीं है",
        status: "extracted",
        confidence: 0.95,
        charRange: [186, 234],
        isVerified: true
      },
      swellingPedalEdema: {
        value: false,
        status: "extracted"
      },
      bleedingOrSpotting: {
        value: false,
        status: "extracted"
      },
      fetalMovementNormal: {
        value: true,
        status: "extracted"
      }
    },
    interventions: {
      ifaTabletsGiven: {
        value: true,
        supportingPhrase: "30 दिन की आयरन और कैल्शियम की गोलियां दी हैं",
        status: "extracted",
        confidence: 0.98,
        charRange: [244, 283]
      },
      calciumTabletsGiven: {
        value: true,
        status: "extracted"
      },
      referralRecommended: {
        value: false,
        status: "extracted"
      }
    },
    evidenceSpans: [
      {
        fieldName: "gestationalAgeWeeks",
        extractedValue: 16,
        startChar: 83,
        endChar: 94,
        sourceText: "16वां हफ्ता",
        confidence: 0.98,
        status: "extracted"
      },
      {
        fieldName: "bloodPressureSystolic",
        extractedValue: 118,
        startChar: 117,
        endChar: 128,
        sourceText: "बीपी 118/76",
        confidence: 0.99,
        status: "extracted"
      },
      {
        fieldName: "weightKg",
        extractedValue: 49.0,
        startChar: 144,
        endChar: 156,
        sourceText: "वजन 49 किलो है",
        confidence: 0.96,
        status: "extracted"
      },
      {
        fieldName: "hemoglobinGDl",
        extractedValue: 11.5,
        startChar: 161,
        endChar: 184,
        sourceText: "हीमोग्लोबिन 11.5 ग्राम है",
        confidence: 0.97,
        status: "extracted"
      }
    ],
    validationWarnings: []
  }
];

export const MOCK_ACTIVITY_DATA = [
  { day: 'Mon', visits: 12, completed: 10, flagged: 2 },
  { day: 'Tue', visits: 15, completed: 13, flagged: 1 },
  { day: 'Wed', visits: 18, completed: 14, flagged: 3 },
  { day: 'Thu', visits: 14, completed: 12, flagged: 1 },
  { day: 'Fri', visits: 20, completed: 17, flagged: 4 },
  { day: 'Sat', visits: 16, completed: 15, flagged: 2 },
  { day: 'Sun', visits: 8, completed: 7, flagged: 0 }
];
