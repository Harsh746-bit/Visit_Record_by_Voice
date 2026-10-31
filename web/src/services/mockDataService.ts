import { Beneficiary, AshaWorker, StructuredVisit } from '../types';
import { MOCK_WORKERS, MOCK_BENEFICIARIES, MOCK_VISIT_RECORDS } from '../data/mockData';

const STORAGE_KEYS = {
  RECORDS: 'vrv_mock_visit_records',
  BENEFICIARIES: 'vrv_mock_beneficiaries',
  WORKERS: 'vrv_mock_workers'
};

class MockDataService {
  private records: StructuredVisit[] = [];
  private beneficiaries: Beneficiary[] = [];
  private workers: AshaWorker[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const savedBeneficiaries = localStorage.getItem(STORAGE_KEYS.BENEFICIARIES);
    const savedWorkers = localStorage.getItem(STORAGE_KEYS.WORKERS);

    this.records = savedRecords ? JSON.parse(savedRecords) : [...MOCK_VISIT_RECORDS];
    this.beneficiaries = savedBeneficiaries ? JSON.parse(savedBeneficiaries) : [...MOCK_BENEFICIARIES];
    this.workers = savedWorkers ? JSON.parse(savedWorkers) : [...MOCK_WORKERS];
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(this.records));
      localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(this.beneficiaries));
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(this.workers));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  // Visit Records CRUD
  public getRecords(): StructuredVisit[] {
    return [...this.records];
  }

  public getRecordById(id: string): StructuredVisit | undefined {
    return this.records.find(r => r.recordId === id);
  }

  public addRecord(record: StructuredVisit): void {
    this.records.unshift(record);
    this.save();
  }

  public updateReviewStatus(recordId: string, status: 'reviewed' | 'returned', notes: string): StructuredVisit | null {
    const rec = this.records.find(r => r.recordId === recordId);
    if (rec) {
      rec.anmReviewStatus = status;
      rec.anmReviewNotes = notes;
      rec.reviewedAt = new Date().toISOString();
      this.save();
      return { ...rec };
    }
    return null;
  }

  // Beneficiaries
  public getBeneficiaries(): Beneficiary[] {
    return [...this.beneficiaries];
  }

  public getBeneficiaryById(id: string): Beneficiary | undefined {
    return this.beneficiaries.find(b => b.id === id);
  }

  // ASHA Workers
  public getWorkers(): AshaWorker[] {
    return [...this.workers];
  }

  // Reset to initial demo data
  public resetDemoData(): void {
    this.records = [...MOCK_VISIT_RECORDS];
    this.beneficiaries = [...MOCK_BENEFICIARIES];
    this.workers = [...MOCK_WORKERS];
    this.save();
  }
}

export const mockDataService = new MockDataService();
