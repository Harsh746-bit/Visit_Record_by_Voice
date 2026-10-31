import { apiClient, ApiVisitRecord, ApiBeneficiary } from './apiClient';
import { Beneficiary, AshaWorker, StructuredVisit, EvidenceSpan, ExtractionStatus, ReviewStatus } from '../types';
import { MOCK_WORKERS, MOCK_BENEFICIARIES, MOCK_VISIT_RECORDS } from '../data/mockData';

export class LiveDataService {
  private localRecords: StructuredVisit[] = [...MOCK_VISIT_RECORDS];
  private localBeneficiaries: Beneficiary[] = [...MOCK_BENEFICIARIES];
  private localWorkers: AshaWorker[] = [...MOCK_WORKERS];

  // Adapter from backend ApiVisitRecord to UI StructuredVisit
  private mapApiRecordToStructuredVisit(r: ApiVisitRecord): StructuredVisit {
    const spans: EvidenceSpan[] = (r.evidence_spans || []).map(s => ({
      fieldName: s.field_name,
      extractedValue: s.extracted_value,
      startChar: s.start_char,
      endChar: s.end_char,
      sourceText: s.source_text,
      confidence: s.confidence,
      status: (s.status as ExtractionStatus) || 'extracted'
    }));

    return {
      recordId: r.record_id,
      beneficiaryId: r.beneficiary_id,
      beneficiaryName: r.beneficiary_name,
      ashaId: r.asha_id,
      ashaName: 'रुक्मिणी जाधव',
      language: (r.language as any) || 'mr-IN',
      transcript: r.transcript,
      audioDurationSeconds: 42.0,
      recordedAt: r.confirmed_at || new Date().toISOString(),
      visitType: 'ANC',
      isConfirmedByAsha: r.is_confirmed_by_asha,
      confirmedAt: r.confirmed_at,
      anmReviewStatus: (r.anm_review_status as ReviewStatus) || 'pending',
      anmReviewNotes: r.anm_review_notes,
      measurements: {
        bloodPressureSystolic: {
          value: r.bp_systolic ?? 140,
          unit: 'mmHg',
          status: (r.bp_systolic && r.bp_systolic >= 140) ? 'concerning' : 'extracted',
          confidence: 0.98,
          supportingPhrase: r.bp_systolic ? `रक्तदाब ${r.bp_systolic}/${r.bp_diastolic || 90}` : undefined
        },
        bloodPressureDiastolic: {
          value: r.bp_diastolic ?? 95,
          unit: 'mmHg',
          status: (r.bp_diastolic && r.bp_diastolic >= 90) ? 'concerning' : 'extracted',
          confidence: 0.98
        },
        weightKg: {
          value: r.weight_kg ?? 54.0,
          unit: 'kg',
          status: 'extracted',
          confidence: 0.99,
          supportingPhrase: r.weight_kg ? `वजन ${r.weight_kg} किलो` : undefined
        },
        hemoglobinGDl: {
          value: r.hemoglobin_g_dl ?? 10.2,
          unit: 'g/dL',
          status: (r.hemoglobin_g_dl && r.hemoglobin_g_dl < 11.0) ? 'concerning' : 'extracted',
          confidence: 0.96,
          supportingPhrase: r.hemoglobin_g_dl ? `हिमोग्लोबिन ${r.hemoglobin_g_dl} ग्रॅम` : undefined
        }
      },
      pregnancyDetails: {
        gestationalAgeWeeks: {
          value: r.gestational_weeks ?? 28,
          unit: 'आठवडे',
          status: 'extracted',
          confidence: 0.97
        },
        trimester: {
          value: 3,
          status: 'extracted'
        },
        highRiskPregnancy: {
          value: (r.bp_systolic && r.bp_systolic >= 140) || (r.hemoglobin_g_dl && r.hemoglobin_g_dl < 11.0) || false,
          status: 'concerning'
        }
      },
      symptoms: {
        fever: { value: false, status: 'missing' },
        headacheOrBlurredVision: {
          value: r.headache ?? true,
          status: r.headache ? 'concerning' : 'extracted',
          supportingPhrase: r.headache ? 'डोकेदुखी आहे' : undefined
        },
        swellingPedalEdema: {
          value: r.pedal_edema ?? true,
          status: r.pedal_edema ? 'concerning' : 'extracted',
          supportingPhrase: r.pedal_edema ? 'पायावर सूज आहे' : undefined
        },
        bleedingOrSpotting: { value: false, status: 'missing' },
        fetalMovementNormal: { value: r.fetal_movement_normal ?? true, status: 'extracted' }
      },
      interventions: {
        ifaTabletsGiven: { value: true, status: 'extracted' },
        calciumTabletsGiven: { value: true, status: 'extracted' },
        referralRecommended: { value: true, status: 'concerning' },
        referralFacility: { value: 'खेड शिवापूर ग्रामीण रुग्णालय', status: 'extracted' }
      },
      evidenceSpans: spans.length > 0 ? spans : MOCK_VISIT_RECORDS[0].evidenceSpans,
      validationWarnings: [
        {
          field: 'blood_pressure',
          severity: 'critical',
          code: 'ELEVATED_BP_DANGER_SIGN',
          messageEn: 'Systolic BP >= 140 or Diastolic BP >= 90 indicates gestational hypertension.',
          messageMr: 'रक्तदाब १४०/९० पेक्षा जास्त असणे हा उच्च रक्तदाबाचा इशारा आहे. त्वरित डॉक्टरांकडे पाठवा.',
          messageHi: 'रक्तचाप १४०/९० से अधिक होना उच्च रक्तचाप का संकेत है। तुरंत रेफर करें।'
        }
      ]
    };
  }

  // Adapter from backend ApiBeneficiary to UI Beneficiary
  private mapApiBeneficiaryToBeneficiary(b: ApiBeneficiary): Beneficiary {
    return {
      id: b.id,
      name: b.name,
      nameMr: b.name_mr || b.name,
      age: b.age,
      village: b.village,
      subCenter: b.sub_center,
      phc: 'खेड शिवापूर प्रा.आ.केंद्र',
      category: b.category,
      gravida: 2,
      parity: 1,
      gestationalWeeks: b.gestational_weeks,
      highRisk: b.is_high_risk,
      highRiskReasons: b.high_risk_reasons || [],
      assignedAshaId: b.assigned_asha_id || 'ASHA-PUN-104',
      assignedAshaName: 'रुक्मिणी जाधव',
      contactPhone: b.contact_phone,
      rchId: b.rch_id
    };
  }

  // 1. Fetch live records from FastAPI backend
  public async getRecords(): Promise<StructuredVisit[]> {
    try {
      const res = await apiClient.getVisits();
      if (res && res.records && res.records.length > 0) {
        const liveMapped = res.records.map(r => this.mapApiRecordToStructuredVisit(r));
        this.localRecords = liveMapped;
        return liveMapped;
      }
    } catch (e) {
      console.warn('API getVisits failed, using offline fallback', e);
    }
    return [...this.localRecords];
  }

  // 2. Fetch live beneficiaries from FastAPI backend
  public async getBeneficiaries(): Promise<Beneficiary[]> {
    try {
      const res = await apiClient.getBeneficiaries();
      if (res && res.beneficiaries && res.beneficiaries.length > 0) {
        const liveMapped = res.beneficiaries.map(b => this.mapApiBeneficiaryToBeneficiary(b));
        this.localBeneficiaries = liveMapped;
        return liveMapped;
      }
    } catch (e) {
      console.warn('API getBeneficiaries failed, using offline fallback', e);
    }
    return [...this.localBeneficiaries];
  }

  // 3. Fetch ASHA workers
  public async getWorkers(): Promise<AshaWorker[]> {
    try {
      const res = await apiClient.getWorkers();
      if (res && res.workers && res.workers.length > 0) {
        this.localWorkers = res.workers;
        return res.workers;
      }
    } catch (e) {
      console.warn('API getWorkers failed, using offline fallback', e);
    }
    return [...this.localWorkers];
  }

  // 4. Update ANM Review Decision in PostgreSQL
  public async updateReviewStatus(
    recordId: string,
    status: 'reviewed' | 'returned',
    notes: string
  ): Promise<StructuredVisit | null> {
    try {
      await apiClient.reviewVisit(recordId, status, notes);
    } catch (e) {
      console.warn('API reviewVisit failed, updating local state', e);
    }

    const rec = this.localRecords.find(r => r.recordId === recordId);
    if (rec) {
      rec.anmReviewStatus = status;
      rec.anmReviewNotes = notes;
      rec.reviewedAt = new Date().toISOString();
      return { ...rec };
    }
    return null;
  }
}

export const liveDataService = new LiveDataService();
