export interface TranslationSchema {
  appTitle: string;
  tagline: string;
  subtitle: string;
  anmPortal: string;
  ashaSimulator: string;
  dualView: string;
  overview: string;
  workers: string;
  beneficiaries: string;
  records: string;
  reviewQueue: string;
  reports: string;
  settings: string;
  liveSynced: string;
  notifications: string;

  // Frontline ASHA specific
  recordNewVisit: string;
  todayVisits: string;
  completed: string;
  pending: string;
  ashaGreeting: string;
  khedCircle: string;
  searchBeneficiary: string;
  startRecording: string;
  stopRecording: string;
  speakingGuidance: string;
  transcriptReview: string;
  aiStructuredRecord: string;
  evidenceReview: string;
  dangerSigns: string;
  confirmSubmit: string;
  successMsg: string;

  // Steps
  stepDashboard: string;
  stepRecording: string;
  stepTranscript: string;
  stepEvidence: string;
  stepConfirm: string;

  // Dashboard / Hero
  heroTitle: string;
  heroSubtitle: string;
  totalRecordsCreated: string;
  draftsAwaiting: string;
  highRiskAlerts: string;
  registeredBeneficiaries: string;
  selectBeneficiary: string;
  recentRecords: string;
  voiceVerified: string;

  // Recording Screen
  voiceRecordingTitle: string;
  listeningNotice: string;
  tapToRecord: string;
  tapToStop: string;
  uploadAudio: string;
  useDemoSample: string;
  whatToSayTitle: string;
  whatToSaySubtitle: string;
  recordingTipsTitle: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;

  // Transcript Screen
  verbatimTranscriptTitle: string;
  verbatimSubtitle: string;
  transcribingNotice: string;
  playRecording: string;
  playingAudio: string;
  editableTranscript: string;
  editTranscriptBtn: string;
  doneEditBtn: string;
  reRecordBtn: string;
  extractRecordBtn: string;

  // Evidence Mapping Screen
  evidenceTitle: string;
  evidenceSubtitle: string;
  evidencePill: string;
  evidencePrinciple: string;
  fieldHeader: string;
  valueHeader: string;
  evidenceHeader: string;
  statusHeader: string;
  actionHeader: string;
  verifiedStatus: string;
  missingStatus: string;

  // Confirmation Screen
  confirmTitle: string;
  confirmSubtitle: string;
  humanSignoffNotice: string;
  downloadPdf: string;
  downloadJson: string;
  downloadCsv: string;
  saveToDbBtn: string;
  backToEvidenceBtn: string;

  // Graph & Analytics
  graphTitle: string;
  graphSubtitle: string;
  graphTotalVisits: string;
  graphMarathiVoice: string;
  graphHindiVoice: string;
  graphVerified: string;
  graphAccuracyPill: string;
  graphTimePill: string;

  // Measurements
  bloodPressure: string;
  weight: string;
  hemoglobin: string;
  gestationalAge: string;
  headache: string;
  pedalEdema: string;
  fetalMovement: string;
  ifaTablets: string;
  referral: string;

  // Status
  highRisk: string;
  normal: string;
  approved: string;
  returned: string;
  pendingReview: string;

  // Overview & Clinical Extra
  anmSupervisorDashboard: string;
  anmSupervisorSubtitle: string;
  reviewPendingQueue: string;
  assignedAshaWorkers: string;
  activeInFieldToday: string;
  urgentClinicalTriage: string;
  urgentTriageSubtitle: string;
  recentSubmissions: string;
  recentSubmissionsSubtitle: string;
  ashaFieldProgress: string;
  viewAll: string;
  inspect: string;

  // Flow & Subnav
  ashaFlowHeader: string;
  ashaFlowRoadmapSub: string;
  roadmapFullUi: string;
  roadmapPhoneFrame: string;
  backToDashboardBtn: string;
  backToTranscriptBtn: string;
  proceedToConfirmBtn: string;
  maternalBeneficiaryLabel: string;
  jurisdictionLabel: string;
  complaintsTriageLabel: string;
  exportPhaseTitle: string;
  confirmSaveSuccess: string;
}

export const translations: Record<'mr' | 'hi' | 'en', TranslationSchema> = {
  mr: {
    appTitle: 'भेट नोंदणी आवाज',
    tagline: 'बोला. पडताळा. नोंदवा.',
    subtitle: 'महाराष्ट्र आशा व एएनएम डिजिटल आरोग्य मंच',
    anmPortal: 'एएनएम पर्यवेक्षण पोर्टल',
    ashaSimulator: 'आशा भेट प्रवाह (ASHA Flow)',
    dualView: 'थेट दुहेरी दृश्य (Dual View)',
    overview: 'एकूण आढावा',
    workers: 'आशा कार्यकर्त्या',
    beneficiaries: 'लाभार्थी यादी',
    records: 'भेट नोंदी',
    reviewQueue: 'पुनरावलोकन रांग (Review Queue)',
    reports: 'अहवाल व आकडेवारी',
    settings: 'प्रणाली सेटिंग्ज',
    liveSynced: 'थेट जोडलेले (Live)',
    notifications: 'सूचना',

    // Frontline ASHA specific
    recordNewVisit: 'नवीन भेट नोंदवा',
    todayVisits: 'आजच्या भेटी',
    completed: 'पूर्ण झाल्या',
    pending: 'प्रलंबित',
    ashaGreeting: 'नमस्ते, रुक्मिणी ताई',
    khedCircle: 'खेड शिवापूर उपकेंद्र, पुणे',
    searchBeneficiary: 'नाव, आरसीएच आयडी किंवा गाव शोधा...',
    startRecording: 'आवाज रेकॉर्ड करा',
    stopRecording: 'रेकॉर्डिंग थांबवा',
    speakingGuidance: 'घरभेटीबद्दल नैसर्गिकरीत्या बोला. मराठी, हिंदी किंवा वैद्यकीय शब्द वापरू शकता.',
    transcriptReview: 'आवाजाचे रूपांतर (Transcript)',
    aiStructuredRecord: 'तयार झालेली भेट नोंद',
    evidenceReview: 'पुरावा पडताळणी (Traceable Evidence)',
    dangerSigns: 'वैद्यकीय धोक्याचे इशारे',
    confirmSubmit: 'माहितीची खात्री करून सबमिट करा',
    successMsg: 'भेट नोंद यशस्वीरित्या जतन केली!',

    // Steps
    stepDashboard: '१. डॅशबोर्ड',
    stepRecording: '२. आवाज नोंदणी',
    stepTranscript: '३. मजकूर तपासणी',
    stepEvidence: '४. पुरावा पडताळणी (USP)',
    stepConfirm: '५. अंतिम खात्री व डाउनलोड',

    // Dashboard / Hero
    heroTitle: 'माता आरोग्य भेट नोंदणी व पुरावा प्रणाली',
    heroSubtitle: 'मराठी किंवा हिंदीत घरभेटीचे वर्णन बोला. Sarvam Saaras v3 द्वारे थेट मजकूर तयार होईल आणि प्रत्येक आकड्याचा पुरावा पडताळून खात्रीशीर डिजिटल आरोग्य नोंद बनेल.',
    totalRecordsCreated: 'एकूण तयार केलेल्या नोंदी',
    draftsAwaiting: 'खात्री बाकी असलेल्या नोंदी',
    highRiskAlerts: 'उच्च जोखीम इशारे (BP / Anemia)',
    registeredBeneficiaries: 'नोंदणीकृत गरोदर माता',
    selectBeneficiary: 'घरभेटीसाठी लाभार्थी माता निवडा:',
    recentRecords: 'अलिकडील घरभेट आरोग्य नोंदी',
    voiceVerified: '✓ आवाजाच्या पुराव्यासह प्रमाणित',

    // Recording Screen
    voiceRecordingTitle: 'आवाज नोंदणी (Voice Encounter)',
    listeningNotice: 'थेट मायक्रोफोन रेकॉर्डिंग सुरू आहे • Listening to your voice...',
    tapToRecord: 'रेकॉर्डिंग सुरू करण्यासाठी खालील मायक्रोफोन बटण दाबा',
    tapToStop: 'थांबवण्यासाठी लाल बटण दाबा',
    uploadAudio: 'किंवा ऑडिओ फाईल अपलोड करा',
    useDemoSample: 'डिफॉल्ट सॅम्पल वापरा (Demo Sample) →',
    whatToSayTitle: 'घरभेटीत काय बोलावे? (Speaking Guide)',
    whatToSaySubtitle: 'मराठीत नैसर्गिकपणे खालीलप्रमाणे बोला:',
    recordingTipsTitle: 'महत्वाच्या रेकॉर्डिंग टिप्स:',
    tip1: 'नेहमी शांत वातावरणात बोला जेणेकरून आवाज स्पष्ट रेकॉर्ड होईल.',
    tip2: 'आकडे स्पष्ट सांगा: उदा. "बीपी १४० बाय ९५" किंवा "वजन ५४ किलो".',
    tip3: 'वैद्यकीय शब्द (BP, Hb, IFA, PHC) मराठी किंवा इंग्रजीत बोलू शकता.',
    tip4: 'AI स्वतःहून कोणतेही मूल्य जोडत नाही; जे बोलाल त्याचाच पुरावा तयार होतो.',

    // Transcript Screen
    verbatimTranscriptTitle: 'आवाजाचे रूपांतर • Verbatim Spoken Transcript',
    verbatimSubtitle: 'क्लिनिकल माहिती काढण्यापूर्वी संगणकाने ऐकलेला मजकूर तपासा',
    transcribingNotice: 'Sarvam Saaras v3 द्वारे आवाज मजकुरात रूपांतरित केला जात आहे...',
    playRecording: 'रेकॉर्ड केलेला आवाज ऐका',
    playingAudio: 'आवाज ऐकवला जात आहे...',
    editableTranscript: 'मान्यताप्राप्त मजकूर (Editable Transcript):',
    editTranscriptBtn: 'मजकूर दुरुस्त करा (Edit Text)',
    doneEditBtn: 'बदल पूर्ण करा (Done)',
    reRecordBtn: '← पुन्हा रेकॉर्ड करा (Re-record)',
    extractRecordBtn: 'AI माहिती तयार करा (Extract Structured Record) →',

    // Evidence Mapping Screen
    evidenceTitle: 'तयार झालेली नोंद व पुरावा पडताळणी',
    evidenceSubtitle: 'प्रत्येक काढलेला आकडा बोललेल्या शब्दांशी जोडलेला आहे. पुराव्याशिवाय खोटी माहिती तयार होत नाही.',
    evidencePill: 'मुख्य वैशिष्ट्य: शब्द-स्तरीय पुरावा पडताळणी',
    evidencePrinciple: 'पुरावा नियम: जर एखादी माहिती संभाषणात नसेल तर AI ती न लिहिता "उपलब्ध नाही" (Missing) ठेवते.',
    fieldHeader: 'नोंद घटक (Field)',
    valueHeader: 'काढलेले मूल्य (Extracted Value)',
    evidenceHeader: 'बोललेले पुरावा शब्द (Evidence Words)',
    statusHeader: 'पडताळणी दर्जा (Status)',
    actionHeader: 'बदल (Edit)',
    verifiedStatus: '✓ पडताळणी झाली',
    missingStatus: '⚠️ नोंदविले नाही',

    // Confirmation Screen
    confirmTitle: 'भेट नोंद अंतिम खात्री व डाउनलोड',
    confirmSubtitle: 'AI माहिती काढते, पुरावा माहितीचे स्पष्टीकरण देतो, आणि आरोग्य कर्मचारी अंतिम निर्णय घेतात.',
    humanSignoffNotice: 'मी खात्री करते की ही भेट नोंद मी प्रत्यक्ष तपासणी करून आवाजाद्वारे अचूक नोंदवली आहे. सर्व आकडे व संदर्भ सूचना मी पडताळल्या आहेत.',
    downloadPdf: 'PDF अहवाल डाउनलोड करा',
    downloadJson: 'JSON (FHIR) डाउनलोड करा',
    downloadCsv: 'CSV डेटा डाउनलोड करा',
    saveToDbBtn: 'नोंद जतन करा आणि सिंक करा (Confirm & Save)',
    backToEvidenceBtn: '← पुरावा तपासणीकडे परत',

    // Graph & Analytics
    graphTitle: 'दैनिक भेट नोंदणी प्रमाण व भाषा विश्लेषण (Daily Documentation Volume)',
    graphSubtitle: 'मराठी व हिंदी आवाज नोंदींवरून तयार झालेल्या डिजिटल आरोग्य नोंदी',
    graphTotalVisits: 'एकूण नोंदी',
    graphMarathiVoice: 'मराठी आवाज नोंदी',
    graphHindiVoice: 'हिंदी आवाज नोंदी',
    graphVerified: 'तपासणी पूर्ण',
    graphAccuracyPill: '९८.४% अचूकता',
    graphTimePill: 'सरासरी वेळ: ४२ सेकंद',

    // Measurements
    bloodPressure: 'रक्तदाब (BP)',
    weight: 'वजन (Weight)',
    hemoglobin: 'हिमोग्लोबिन (Hb)',
    gestationalAge: 'गरोदरपणाचे आठवडे',
    headache: 'डोकेदुखी',
    pedalEdema: 'पायावर सूज',
    fetalMovement: 'बाळाची हालचाल',
    ifaTablets: 'आयर्नच्या गोळ्या (IFA)',
    referral: 'रुग्णालय संदर्भ (Referral)',

    // Status
    highRisk: 'उच्च जोखीम (High Risk)',
    normal: 'सामान्य (Normal)',
    approved: 'एएनएम मंजूर',
    returned: 'सुधारणेसाठी परत',
    pendingReview: 'तपासणी बाकी',

    // Overview & Clinical Extra
    anmSupervisorDashboard: 'एएनएम पर्यवेक्षण क्लिनिकल डॅशबोर्ड',
    anmSupervisorSubtitle: 'आशा कार्यकर्त्यांनी आवाजाद्वारे नोंदवलेल्या गरोदर व बाळंतपण भेटींचे पुनरावलोकन. मराठी व हिंदी प्रतिलेख पुरावा तपासा आणि उच्च जोखीम मातांचे त्वरित वर्गीकरण करा.',
    reviewPendingQueue: 'प्रलंबित रांग तपासा',
    assignedAshaWorkers: 'नेमलेल्या आशा कार्यकर्त्या',
    activeInFieldToday: 'आज १००% क्षेत्रात कार्यरत',
    urgentClinicalTriage: 'त्वरित वैद्यकीय वर्गीकरण (Triage)',
    urgentTriageSubtitle: 'थेट बोललेल्या शब्दांच्या पुराव्यावरून वैद्यकीय नियमांद्वारे शोधलेले धोक्याचे इशारे.',
    recentSubmissions: 'अलिकडील फ्रंटलाइन भेट नोंदी',
    recentSubmissionsSubtitle: 'प्रत्येक शब्दाच्या पुराव्यासह तयार केलेल्या डिजिटल आरोग्य नोंदी',
    ashaFieldProgress: 'आशा क्षेत्रीय प्रगती',
    viewAll: 'सर्व पहा',
    inspect: 'तपासा →',

    // Flow & Subnav
    ashaFlowHeader: 'फ्रंटलाइन आशा कार्यकर्ता आरोग्य व्हॉइस इंटरफेस',
    ashaFlowRoadmapSub: '५ सोप्या पायऱ्या: डॅशबोर्ड → आवाज नोंदणी → मजकूर तपासणी → पुरावा पडताळणी → अंतिम खात्री व डाउनलोड',
    roadmapFullUi: '५-स्क्रीन संपूर्ण रोडमॅप प्रवाह',
    roadmapPhoneFrame: 'स्मार्टफोन फ्रेम',
    backToDashboardBtn: '← डॅशबोर्डवर परत',
    backToTranscriptBtn: '← मजकुरावर परत',
    proceedToConfirmBtn: 'अंतिम खात्रीकडे पुढे →',
    maternalBeneficiaryLabel: 'माता लाभार्थी (Maternal Beneficiary)',
    jurisdictionLabel: 'कार्यक्षेत्र (Jurisdiction)',
    complaintsTriageLabel: 'तक्रारी व संदर्भ सूचना (Complaints & Triage):',
    exportPhaseTitle: 'खात्री झालेली नोंद डाउनलोड व एक्सपोर्ट करा (Phase 9):',
    confirmSaveSuccess: '✅ भेट नोंद यशस्वीरित्या जतन झाली आणि PHC पोर्टलवर सिंक केली गेली!'
  },
  hi: {
    appTitle: 'विज़िट रिकॉर्ड बाई वॉइस',
    tagline: 'बोलिए. जांचिए. दर्ज करें.',
    subtitle: 'महाराष्ट्र आशा व एएनएम डिजिटल स्वास्थ्य मंच',
    anmPortal: 'एएनएम पर्यवेक्षण पोर्टल',
    ashaSimulator: 'आशा विज़िट प्रवाह (ASHA Flow)',
    dualView: 'लाइव डुअल-व्यू (Dual View)',
    overview: 'कुल अवलोकन',
    workers: 'आशा कार्यकर्ता',
    beneficiaries: 'लाभार्थी सूची',
    records: 'विज़िट रिकॉर्ड्स',
    reviewQueue: 'समीक्षा कतार (Review Queue)',
    reports: 'रिपोर्ट व आंकड़े',
    settings: 'सिस्टम सेटिंग्स',
    liveSynced: 'लाइव सिंक (Live)',
    notifications: 'सूचनाएं',

    // Frontline ASHA specific
    recordNewVisit: 'नई विज़िट दर्ज करें',
    todayVisits: 'आज की विज़िट्स',
    completed: 'पूर्ण',
    pending: 'लंबित',
    ashaGreeting: 'नमस्ते, रुक्मिणी जी',
    khedCircle: 'खेड शिवापुर उपकेंद्र, पुणे',
    searchBeneficiary: 'नाम, आरसीएच आईडी या गांव खोजें...',
    startRecording: 'आवाज़ रिकॉर्ड करें',
    stopRecording: 'रिकॉर्डिंग रोकें',
    speakingGuidance: 'गृह भेंट के बारे में सहजता से बोलें। हिंदी, मराठी या मेडिकल शब्द बोल सकते हैं।',
    transcriptReview: 'ध्वनि प्रतिलेख (Transcript)',
    aiStructuredRecord: 'तैयार विज़िट रिकॉर्ड',
    evidenceReview: 'प्रमाण समीक्षा (Traceable Evidence)',
    dangerSigns: 'नैदानिक खतरे के संकेत',
    confirmSubmit: 'पुष्टि करें और सबमिट करें',
    successMsg: 'विज़िट रिकॉर्ड सफलतापूर्वक सहेजा गया!',

    // Steps
    stepDashboard: '१. डैशबोर्ड',
    stepRecording: '२. आवाज़ रिकॉर्डिंग',
    stepTranscript: '३. प्रतिलेख जांच',
    stepEvidence: '४. प्रमाण मिलान (USP)',
    stepConfirm: '५. अंतिम पुष्टि व डाउनलोड',

    // Dashboard / Hero
    heroTitle: 'मातृ स्वास्थ्य विज़िट रिकॉर्डिंग व प्रमाण मंच',
    heroSubtitle: 'हिंदी या मराठी में गृह भेंट का विवरण बोलें। Sarvam Saaras v3 से स्वतः टेक्स्ट बनेगा और हर आंकड़े का प्रमाण जांचकर डिजिटल स्वास्थ्य रिकॉर्ड बनेगा।',
    totalRecordsCreated: 'कुल तैयार रिकॉर्ड्स',
    draftsAwaiting: 'पुष्टि हेतु लंबित रिकॉर्ड्स',
    highRiskAlerts: 'उच्च जोखिम चेतावनी (BP / Anemia)',
    registeredBeneficiaries: 'पंजीकृत गर्भवती माताएं',
    selectBeneficiary: 'गृह भेंट हेतु लाभार्थी माता चुनें:',
    recentRecords: 'हालिया गृह भेंट स्वास्थ्य रिकॉर्ड्स',
    voiceVerified: '✓ ध्वनि प्रमाण द्वारा सत्यापित',

    // Recording Screen
    voiceRecordingTitle: 'आवाज़ रिकॉर्डिंग (Voice Encounter)',
    listeningNotice: 'लाइव माइक्रोफ़ोन रिकॉर्डिंग जारी है • Listening to your voice...',
    tapToRecord: 'रिकॉर्डिंग शुरू करने के लिए नीचे दिया माइक्रोफ़ोन दबाएं',
    tapToStop: 'रोकने के लिए लाल बटन दबाएं',
    uploadAudio: 'या ऑडियो फ़ाइल अपलोड करें',
    useDemoSample: 'डिफ़ॉल्ट नमूना प्रयोग करें (Demo Sample) →',
    whatToSayTitle: 'गृह भेंट में क्या बोलें? (Speaking Guide)',
    whatToSaySubtitle: 'हिंदी में स्वाभाविक रूप से इस तरह बोलें:',
    recordingTipsTitle: 'महत्वपूर्ण रिकॉर्डिंग सुझाव:',
    tip1: 'शांत वातावरण में बोलें ताकि आवाज़ स्पष्ट रूप से रिकॉर्ड हो सके।',
    tip2: 'आंकड़े स्पष्ट बताएं: जैसे "बीपी 140 बटा 95" या "वजन 54 किलो"।',
    tip3: 'चिकित्सा शब्द (BP, Hb, IFA, PHC) हिंदी या अंग्रेज़ी में बोल सकते हैं।',
    tip4: 'एआई अपनी ओर से कुछ नहीं जोड़ता; आप जो बोलेंगे उसी का प्रमाण बनेगा।',

    // Transcript Screen
    verbatimTranscriptTitle: 'ध्वनि प्रतिलेख • Verbatim Spoken Transcript',
    verbatimSubtitle: 'क्लिनिकल डेटा निकालने से पहले बोले गए शब्दों की पुष्टि करें',
    transcribingNotice: 'Sarvam Saaras v3 द्वारा आवाज़ को टेक्स्ट में बदला जा रहा है...',
    playRecording: 'रिकॉर्ड की गई आवाज़ सुनें',
    playingAudio: 'आवाज़ बज रही है...',
    editableTranscript: 'मान्यता प्राप्त टेक्स्ट (Editable Transcript):',
    editTranscriptBtn: 'टेक्स्ट संपादित करें (Edit Text)',
    doneEditBtn: 'संपादन पूर्ण करें (Done)',
    reRecordBtn: '← पुनः रिकॉर्ड करें (Re-record)',
    extractRecordBtn: 'एआई डेटा तैयार करें (Extract Structured Record) →',

    // Evidence Mapping Screen
    evidenceTitle: 'संरचित रिकॉर्ड व प्रमाण समीक्षा',
    evidenceSubtitle: 'प्रत्येक निकाला गया आंकड़ा बोले गए शब्दों से जुड़ा है। बिना प्रमाण कोई मनगढ़ंत डेटा नहीं बनता।',
    evidencePill: 'मुख्य खूबी: शब्द-स्तरीय प्रमाण सत्यापन',
    evidencePrinciple: 'प्रमाण नियम: यदि कोई जानकारी बातचीत में नहीं है तो एआई उसे "अनुपलब्ध" (Missing) रखता है।',
    fieldHeader: 'फ़ील्ड (Field)',
    valueHeader: 'निकाला गया मान (Extracted Value)',
    evidenceHeader: 'बोले गए प्रमाण शब्द (Evidence Words)',
    statusHeader: 'सत्यापन स्थिति (Status)',
    actionHeader: 'बदलें (Edit)',
    verifiedStatus: '✓ सत्यापित',
    missingStatus: '⚠️ दर्ज नहीं',

    // Confirmation Screen
    confirmTitle: 'विज़िट रिकॉर्ड अंतिम पुष्टि व डाउनलोड',
    confirmSubtitle: 'एआई रिकॉर्ड बनाता है, प्रमाण स्पष्ट करता है, और स्वास्थ्य कार्यकर्ता अंतिम निर्णय लेते हैं।',
    humanSignoffNotice: 'मैं पुष्टि करती हूँ कि यह विज़िट रिकॉर्ड मैंने प्रत्यक्ष जांच कर आवाज़ द्वारा दर्ज किया है। सभी आंकड़े व संदर्भ मैंने जांच लिए हैं।',
    downloadPdf: 'PDF रिपोर्ट डाउनलोड करें',
    downloadJson: 'JSON (FHIR) डाउनलोड करें',
    downloadCsv: 'CSV डेटा डाउनलोड करें',
    saveToDbBtn: 'रिकॉर्ड सहेजें व सिंक करें (Confirm & Save)',
    backToEvidenceBtn: '← प्रमाण समीक्षा पर वापस',

    // Graph & Analytics
    graphTitle: 'दैनिक विज़िट प्रलेखन मात्रा व भाषा विश्लेषण (Daily Documentation Volume)',
    graphSubtitle: 'मराठी व हिंदी आवाज़ नोट्स से तैयार किए गए संरचित डिजिटल स्वास्थ्य रिकॉर्ड',
    graphTotalVisits: 'कुल विज़िट्स',
    graphMarathiVoice: 'मराठी आवाज़ नोट्स',
    graphHindiVoice: 'हिंदी आवाज़ नोट्स',
    graphVerified: 'सत्यापित रिकॉर्ड्स',
    graphAccuracyPill: '98.4% सटीकता',
    graphTimePill: 'औसत समय: 42 सेकंड',

    // Measurements
    bloodPressure: 'रक्तचाप (BP)',
    weight: 'वजन (Weight)',
    hemoglobin: 'हीमोग्लोबिन (Hb)',
    gestationalAge: 'गर्भ के सप्ताह',
    headache: 'सिरदर्द',
    pedalEdema: 'पैरों में सूजन',
    fetalMovement: 'शिशु की हलचल',
    ifaTablets: 'आयरन की गोलियां (IFA)',
    referral: 'अस्पताल रेफरल',

    // Status
    highRisk: 'उच्च जोखिम (High Risk)',
    normal: 'सामान्य (Normal)',
    approved: 'एएनएम स्वीकृत',
    returned: 'संशोधन हेतु वापस',
    pendingReview: 'समीक्षा लंबित',

    // Overview & Clinical Extra
    anmSupervisorDashboard: 'एएनएम पर्यवेक्षण क्लिनिकल डैशबोर्ड',
    anmSupervisorSubtitle: 'आशा कार्यकर्ताओं द्वारा आवाज़ से दर्ज प्रसवपूर्व व प्रसवोत्तर विज़िट्स की समीक्षा। मराठी व हिंदी ऑडियो साक्ष्य जांचें और उच्च जोखिम माताओं का ट्राइएज करें।',
    reviewPendingQueue: 'लंबित कतार समीक्षा करें',
    assignedAshaWorkers: 'आवंटित आशा कार्यकर्ता',
    activeInFieldToday: 'आज 100% क्षेत्र में सक्रिय',
    urgentClinicalTriage: 'त्वरित नैदानिक ट्राइएज (Triage)',
    urgentTriageSubtitle: 'बोले गए शब्दों के साक्ष्य के आधार पर नैदानिक नियमों द्वारा पहचाने गए खतरे के संकेत।',
    recentSubmissions: 'हालिया फ्रंटलाइन विज़िट प्रविष्टियां',
    recentSubmissionsSubtitle: 'प्रतिलेख साक्ष्य के साथ तैयार डिजिटल स्वास्थ्य रिकॉर्ड',
    ashaFieldProgress: 'आशा क्षेत्रीय प्रगति',
    viewAll: 'सभी देखें',
    inspect: 'जांचें →',

    // Flow & Subnav
    ashaFlowHeader: 'फ्रंटलाइन आशा कार्यकर्ता वॉयस इंटरफ़ेस',
    ashaFlowRoadmapSub: '५ सरल चरण: डैशबोर्ड → आवाज़ रिकॉर्डिंग → प्रतिलेख जांच → प्रमाण मिलान → अंतिम पुष्टि व डाउनलोड',
    roadmapFullUi: '५-स्क्रीन संपूर्ण रोडमॅप प्रवाह',
    roadmapPhoneFrame: 'स्मार्टफोन फ्रेम',
    backToDashboardBtn: '← डैशबोर्ड पर वापस',
    backToTranscriptBtn: '← प्रतिलेख पर वापस',
    proceedToConfirmBtn: 'अंतिम पुष्टि की ओर →',
    maternalBeneficiaryLabel: 'माता लाभार्थी (Maternal Beneficiary)',
    jurisdictionLabel: 'कार्यक्षेत्र (Jurisdiction)',
    complaintsTriageLabel: 'शिकायतें व संदर्भ सुझाव (Complaints & Triage):',
    exportPhaseTitle: 'पुष्टीकृत रिकॉर्ड डाउनलोड व एक्सपोर्ट करें (Phase 9):',
    confirmSaveSuccess: '✅ विज़िट रिकॉर्ड सफलतापूर्वक सहेजा गया और पीएचसी पोर्टल पर सिंक हो गया!'
  },
  en: {
    appTitle: 'Visit Record by Voice',
    tagline: 'Speak. Verify. Record.',
    subtitle: 'AI Multilingual Healthcare Documentation Platform for Maharashtra',
    anmPortal: 'ANM Supervisor Portal',
    ashaSimulator: 'ASHA Visit Workflow',
    dualView: 'Live Dual-View',
    overview: 'Clinical Overview',
    workers: 'ASHA Workers',
    beneficiaries: 'Beneficiary Registry',
    records: 'Visit Records',
    reviewQueue: 'Review Queue',
    reports: 'Reports & Analytics',
    settings: 'System Settings',
    liveSynced: 'Live Synced',
    notifications: 'Notifications',

    // Frontline ASHA specific
    recordNewVisit: 'Record New Visit',
    todayVisits: "Today's Visits",
    completed: 'Completed',
    pending: 'Pending',
    ashaGreeting: 'Welcome, Rukmini Jadhav',
    khedCircle: 'Khed Shivapur Sub-Center, Pune',
    searchBeneficiary: 'Search name, RCH ID or village...',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    speakingGuidance: 'Speak naturally about the home visit. You can use Marathi, Hindi or English medical terms.',
    transcriptReview: 'Transcription Review',
    aiStructuredRecord: 'AI Structured Record',
    evidenceReview: 'Evidence Attribution',
    dangerSigns: 'Clinical Danger Signs',
    confirmSubmit: 'Verify & Confirm Submission',
    successMsg: 'Visit record successfully saved!',

    // Steps
    stepDashboard: '1. Dashboard',
    stepRecording: '2. Voice Recording',
    stepTranscript: '3. Transcript Review',
    stepEvidence: '4. Evidence Mapping (USP)',
    stepConfirm: '5. Confirm & Export',

    // Dashboard / Hero
    heroTitle: 'Antenatal Healthcare Voice Documentation',
    heroSubtitle: 'Speak home visit observations in Marathi or Hindi. Sarvam Saaras v3 transcribes it in real-time, mapping verifiable clinical evidence into structured digital health records.',
    totalRecordsCreated: 'Total Records Created',
    draftsAwaiting: 'Drafts Awaiting Confirmation',
    highRiskAlerts: 'High Risk Alerts (BP / Anemia)',
    registeredBeneficiaries: 'Registered Beneficiaries',
    selectBeneficiary: 'Select Beneficiary Mother for Home Visit:',
    recentRecords: 'Recent Antenatal Visit Records',
    voiceVerified: '✓ Verified with spoken evidence',

    // Recording Screen
    voiceRecordingTitle: 'Voice Recording (Clinical Encounter)',
    listeningNotice: 'Listening to your voice with live microphone...',
    tapToRecord: 'Tap the microphone button to start recording',
    tapToStop: 'Tap the square to stop recording',
    uploadAudio: 'Or upload audio file',
    useDemoSample: 'Use Demo Sample →',
    whatToSayTitle: 'What to Say (Clinical Guide)',
    whatToSaySubtitle: 'Speak naturally in Marathi or Hindi like this:',
    recordingTipsTitle: 'Key Recording Guidelines:',
    tip1: 'Speak in a quiet environment so speech recognition captures clearly.',
    tip2: 'Mention numbers clearly: e.g. "BP 140 over 95" or "weight 54 kg".',
    tip3: 'Medical terms like BP, Hb, IFA tablets and PHC are fully recognized.',
    tip4: 'AI never hallucinates: only explicitly spoken vitals become verified values.',

    // Transcript Screen
    verbatimTranscriptTitle: 'Verbatim Spoken Transcript',
    verbatimSubtitle: 'Review recognized speech before clinical extraction',
    transcribingNotice: 'Sarvam Saaras v3 is transcribing spoken audio into Devanagari text...',
    playRecording: 'Play Spoken Encounter',
    playingAudio: 'Playing voice recording...',
    editableTranscript: 'Recognized Transcript (Editable):',
    editTranscriptBtn: 'Edit Transcript',
    doneEditBtn: 'Save Changes (Done)',
    reRecordBtn: '← Re-record Audio',
    extractRecordBtn: 'Extract Structured Record (AI) →',

    // Evidence Mapping Screen
    evidenceTitle: 'Structured Record & Verifiable Evidence Review',
    evidenceSubtitle: 'Every extracted number is linked to the exact words spoken. Zero hallucinated data.',
    evidencePill: 'Core Differentiator: Traceable Field-Level Evidence',
    evidencePrinciple: 'Evidence Principle: If a vital is not supported by exact spoken words, it is marked as Missing.',
    fieldHeader: 'Clinical Field',
    valueHeader: 'Extracted Value',
    evidenceHeader: 'Supporting Spoken Words (Evidence)',
    statusHeader: 'Validation Status',
    actionHeader: 'Action',
    verifiedStatus: '✓ Verified against transcript',
    missingStatus: '⚠️ Not Provided / Missing',

    // Confirmation Screen
    confirmTitle: 'Human Sign-off & Export',
    confirmSubtitle: 'AI generates the record, evidence explains the record, and the frontline health worker makes the final decision.',
    humanSignoffNotice: 'I verify that this visit record was accurately documented by me via voice examination and all clinical triage recommendations have been reviewed.',
    downloadPdf: 'Download PDF Clinical Report',
    downloadJson: 'Download FHIR JSON',
    downloadCsv: 'Download CSV Record',
    saveToDbBtn: 'Confirm & Save to Health Records',
    backToEvidenceBtn: '← Back to Evidence Review',

    // Graph & Analytics
    graphTitle: 'Daily Visit Documentation Volume & Language Breakdown',
    graphSubtitle: 'Spoken Marathi & Hindi voice notes processed into structured clinical records',
    graphTotalVisits: 'Total Encounters',
    graphMarathiVoice: 'Marathi Voice Notes',
    graphHindiVoice: 'Hindi Voice Notes',
    graphVerified: 'Verified Records',
    graphAccuracyPill: '98.4% Field Accuracy',
    graphTimePill: 'Avg. Audio: 42s',

    // Measurements
    bloodPressure: 'Blood Pressure',
    weight: 'Maternal Weight',
    hemoglobin: 'Hemoglobin (Hb)',
    gestationalAge: 'Gestational Weeks',
    headache: 'Headache',
    pedalEdema: 'Pedal Edema',
    fetalMovement: 'Fetal Movement',
    ifaTablets: 'IFA Tablets Given',
    referral: 'PHC Referral',

    // Status
    highRisk: 'High Risk',
    normal: 'Normal',
    approved: 'ANM Approved',
    returned: 'Returned for Review',
    pendingReview: 'Pending Review',

    // Overview & Clinical Extra
    anmSupervisorDashboard: 'ANM Supervisor Clinical Dashboard',
    anmSupervisorSubtitle: 'Reviewing voice-documented antenatal & postnatal visits from frontline ASHA workers. Verify Marathi & Hindi transcript evidence, validate clinical indicators, and triage high-risk mothers.',
    reviewPendingQueue: 'Review Pending Queue',
    assignedAshaWorkers: 'Assigned ASHA Workers',
    activeInFieldToday: '100% active in field today',
    urgentClinicalTriage: 'Urgent Clinical Triage',
    urgentTriageSubtitle: 'Flagged by clinical decision rules directly from voice transcript evidence.',
    recentSubmissions: 'Recent Frontline Visit Submissions',
    recentSubmissionsSubtitle: 'Processed into structured records with verbatim transcript evidence',
    ashaFieldProgress: 'ASHA Field Progress',
    viewAll: 'View All',
    inspect: 'Inspect →',

    // Flow & Subnav
    ashaFlowHeader: 'Frontline ASHA Worker Healthcare Voice Interface',
    ashaFlowRoadmapSub: '5 Steps: Dashboard → Voice Record → Transcript Review → Evidence Map → Final Confirm & Export',
    roadmapFullUi: '5-Screen Roadmap Flow (Full UI)',
    roadmapPhoneFrame: 'Smartphone Frame',
    backToDashboardBtn: '← Back to Dashboard',
    backToTranscriptBtn: '← Back to Transcript',
    proceedToConfirmBtn: 'Proceed to Confirm →',
    maternalBeneficiaryLabel: 'Maternal Beneficiary',
    jurisdictionLabel: 'Jurisdiction',
    complaintsTriageLabel: 'Complaints & Triage:',
    exportPhaseTitle: 'Export & Download Confirmed Record (Phase 9):',
    confirmSaveSuccess: '✅ Visit record confirmed and synced successfully to the PHC portal!'
  }
};
