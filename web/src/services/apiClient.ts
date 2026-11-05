// Typed API Client for Visit Record by Voice (बोल. पडताळा. नोंदवा.)
// Communicates with FastAPI PostgreSQL backend with JWT access/refresh handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface User {
  id: string;
  phone: string;
  full_name: string;
  full_name_mr?: string;
  role: 'ASHA' | 'ANM' | 'ADMIN';
  district?: string;
  phc?: string;
  sub_center?: string;
  village?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
  user: User;
}

export interface ApiBeneficiary {
  id: string;
  rch_id: string;
  name: string;
  name_mr: string;
  age: number;
  category: string;
  gestational_weeks?: number;
  edd?: string;
  is_high_risk: boolean;
  high_risk_reasons: string[];
  village: string;
  sub_center: string;
  contact_phone: string;
  assigned_asha_id?: string;
}

export interface ApiEvidenceSpan {
  field_name: string;
  extracted_value: string;
  start_char: number;
  end_char: number;
  source_text: string;
  confidence: number;
  status: string;
}

export interface ApiVisitRecord {
  record_id: string;
  visit_id: string;
  visit_type?: string;
  beneficiary_id: string;
  beneficiary_name: string;
  asha_id: string;
  language: string;
  transcript: string;
  bp_systolic?: number;
  bp_diastolic?: number;
  weight_kg?: number;
  hemoglobin_g_dl?: number;
  gestational_weeks?: number;
  headache?: boolean;
  pedal_edema?: boolean;
  fetal_movement_normal?: boolean;
  is_confirmed_by_asha: boolean;
  confirmed_at: string;
  anm_review_status: 'pending' | 'reviewed' | 'returned';
  anm_review_notes?: string;
  evidence_spans: ApiEvidenceSpan[];
}

class ApiClient {
  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setTokens(access: string, refresh?: string) {
    localStorage.setItem('access_token', access);
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }
  }

  public clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = this.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    let response = await fetch(url, config);

    // If 401 Unauthorized, attempt refresh token rotation once
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            this.setTokens(data.access_token, data.refresh_token);
            headers.set('Authorization', `Bearer ${data.access_token}`);
            // Retry original request with renewed access token
            response = await fetch(url, { ...options, headers });
          } else {
            this.clearAuth();
          }
        } catch {
          this.clearAuth();
        }
      }
    }

    if (!response.ok) {
      let errorDetail = `HTTP Error ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorDetail;
      } catch {
        // use fallback
      }
      throw new Error(errorDetail);
    }

    return response.json() as Promise<T>;
  }

  // --- AUTH METHODS ---
  async login(phone: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
    this.setTokens(data.access_token, data.refresh_token);
    localStorage.setItem('user_profile', JSON.stringify(data.user));
    return data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken })
        });
      }
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // --- BENEFICIARIES ---
  async getBeneficiaries(query?: string): Promise<{ beneficiaries: ApiBeneficiary[]; total: number }> {
    const q = query ? `?query=${encodeURIComponent(query)}` : '';
    return this.request<{ beneficiaries: ApiBeneficiary[]; total: number }>(`/beneficiaries${q}`);
  }

  // --- VISITS ---
  async getVisits(status?: string, beneficiaryId?: string): Promise<{ records: ApiVisitRecord[]; total: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (beneficiaryId) params.append('beneficiary_id', beneficiaryId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ records: ApiVisitRecord[]; total: number }>(`/visits${qs}`);
  }

  async getVisit(recordId: string): Promise<ApiVisitRecord> {
    return this.request<ApiVisitRecord>(`/visits/${recordId}`);
  }

  async reviewVisit(recordId: string, action: 'reviewed' | 'returned', notes: string): Promise<{ success: boolean; record_id: string; anm_review_status: string }> {
    return this.request(`/visits/${recordId}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ action, notes })
    });
  }

  // --- ASHA WORKERS ---
  async getWorkers(): Promise<{ workers: any[]; total: number }> {
    return this.request<{ workers: any[]; total: number }>('/workers');
  }

  // --- AUDIO SYNTHESIS & PLAYBACK (SARVAM BULBUL) ---
  async synthesizeSpeech(text: string, language: string = 'mr-IN'): Promise<Blob> {
    const url = `${API_BASE_URL}/audio/synthesize`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, language })
    });
    if (!response.ok) {
      throw new Error(`Audio synthesis failed: ${response.statusText}`);
    }
    return response.blob();
  }

  // --- SPEECH RECOGNITION (SARVAM SAARAS) ---
  async transcribeAudio(audioBlob: Blob, language: string = 'mr-IN'): Promise<{
    transcript: string;
    language: string;
    confidence: number;
    model: string;
    words?: any[];
  }> {
    const url = `${API_BASE_URL}/audio/transcribe`;
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'voice_capture.wav');
    formData.append('language', language);

    const token = this.getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      let detail = `Transcription failed (${response.status})`;
      try {
        const errJson = await response.json();
        detail = errJson.detail || detail;
      } catch {}
      throw new Error(detail);
    }

    return response.json();
  }

  // --- CLINICAL EXTRACTION ---
  async extractRecord(transcript: string, language: string = 'mr-IN', beneficiaryId?: string): Promise<any> {
    const url = `${API_BASE_URL}/visits/extract`;
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        transcript,
        language,
        beneficiary_id: beneficiaryId
      })
    });

    if (!response.ok) {
      throw new Error('Clinical extraction failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
