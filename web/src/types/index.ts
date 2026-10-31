export type LanguageCode = 'mr-IN' | 'hi-IN' | 'en';

export type UserRole = 'asha' | 'anm' | 'admin';

export type ExtractionStatus = 
  | 'extracted' 
  | 'missing' 
  | 'ambiguous' 
  | 'requires_verification' 
  | 'concerning';

export type ReviewStatus = 'pending' | 'reviewed' | 'returned';

export type ValidationSeverity = 'info' | 'warning' | 'critical';

export interface EvidenceSpan {
  fieldName: string;
  extractedValue: string | number | boolean;
  startChar: number;
  endChar: number;
  sourceText: string;
  confidence: number;
  status: ExtractionStatus;
  reasoning?: string;
}

export interface ExtractedField<T = string | number | boolean | null> {
  value: T;
  unit?: string;
  supportingPhrase?: string;
  charRange?: [number, number];
  status: ExtractionStatus;
  confidence?: number;
  isVerified?: boolean;
  editedByUser?: boolean;
}

export interface ValidationWarning {
  field: string;
  severity: ValidationSeverity;
  code: string;
  messageEn: string;
  messageMr: string;
  messageHi: string;
  supportingPhrase?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  nameMr: string;
  age: number;
  village: string;
  subCenter: string;
  phc: string;
  category: string;
  gravida: number;
  parity: number;
  gestationalWeeks?: number;
  lmpDate?: string;
  eddDate?: string;
  highRisk: boolean;
  highRiskReasons: string[];
  assignedAshaId: string;
  assignedAshaName: string;
  contactPhone: string;
  rchId: string;
  lastVisitDate?: string;
}

export interface AshaWorker {
  id: string;
  name: string;
  role: string;
  assignedArea: string;
  district: string;
  phc: string;
  subCenter: string;
  villageCovered: string[];
  assignedAnmName: string;
  phone: string;
  todayVisits: number;
  completedToday: number;
  pendingDrafts: number;
  submittedMonth: number;
  status: 'active' | 'on_leave' | 'in_field';
}

export interface StructuredVisit {
  recordId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  ashaId: string;
  ashaName: string;
  language: LanguageCode;
  transcript: string;
  audioDurationSeconds: number;
  recordedAt: string;
  visitType: 'ANC' | 'PNC' | 'Immunization' | 'General';
  isConfirmedByAsha: boolean;
  confirmedAt?: string;
  anmReviewStatus: ReviewStatus;
  anmReviewNotes?: string;
  reviewedAt?: string;
  
  measurements: {
    bloodPressureSystolic: ExtractedField<number | null>;
    bloodPressureDiastolic: ExtractedField<number | null>;
    weightKg: ExtractedField<number | null>;
    hemoglobinGDl: ExtractedField<number | null>;
    bloodSugarMgDl?: ExtractedField<number | null>;
    fetalHeartRateBpm?: ExtractedField<number | null>;
  };
  pregnancyDetails: {
    gestationalAgeWeeks: ExtractedField<number | null>;
    trimester: ExtractedField<number | null>;
    highRiskPregnancy: ExtractedField<boolean>;
  };
  symptoms: {
    fever: ExtractedField<boolean>;
    headacheOrBlurredVision: ExtractedField<boolean>;
    swellingPedalEdema: ExtractedField<boolean>;
    bleedingOrSpotting: ExtractedField<boolean>;
    fetalMovementNormal: ExtractedField<boolean>;
    generalNotes?: ExtractedField<string | null>;
  };
  interventions: {
    ifaTabletsGiven: ExtractedField<boolean>;
    calciumTabletsGiven: ExtractedField<boolean>;
    referralRecommended: ExtractedField<boolean>;
    referralFacility?: ExtractedField<string | null>;
  };
  
  evidenceSpans: EvidenceSpan[];
  validationWarnings: ValidationWarning[];
}

export type ViewMode = 'anm' | 'asha' | 'dual';

export type AnmNavigationTab = 
  | 'overview' 
  | 'workers' 
  | 'beneficiaries' 
  | 'records' 
  | 'review_queue' 
  | 'reports' 
  | 'settings';
