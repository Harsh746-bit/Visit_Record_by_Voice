package com.visitrecord.app.data.remote

import com.google.gson.annotations.SerializedName

// --- AUTHENTICATION SCHEMAS ---

data class LoginRequest(
    @SerializedName("phone") val phone: String,
    @SerializedName("password") val password: String
)

data class LoginResponse(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("refresh_token") val refreshToken: String,
    @SerializedName("token_type") val tokenType: String,
    @SerializedName("expires_at") val expiresAt: String,
    @SerializedName("user") val user: UserDto
)

data class UserDto(
    @SerializedName("id") val id: String,
    @SerializedName("phone") val phone: String,
    @SerializedName("full_name") val fullName: String,
    @SerializedName("full_name_mr") val fullNameMr: String?,
    @SerializedName("role") val role: String,
    @SerializedName("district") val district: String?,
    @SerializedName("phc") val phc: String?,
    @SerializedName("sub_center") val subCenter: String?,
    @SerializedName("village") val village: String?
)

data class RefreshRequest(
    @SerializedName("refresh_token") val refreshToken: String
)

data class RefreshResponse(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("refresh_token") val refreshToken: String,
    @SerializedName("token_type") val tokenType: String,
    @SerializedName("expires_at") val expiresAt: String
)

// --- BENEFICIARIES ---

data class BeneficiaryDto(
    @SerializedName("id") val id: String,
    @SerializedName("rch_id") val rchId: String,
    @SerializedName("name") val name: String,
    @SerializedName("name_mr") val nameMr: String,
    @SerializedName("age") val age: Int,
    @SerializedName("category") val category: String,
    @SerializedName("gestational_weeks") val gestationalWeeks: Int?,
    @SerializedName("edd") val edd: String?,
    @SerializedName("is_high_risk") val isHighRisk: Boolean,
    @SerializedName("high_risk_reasons") val highRiskReasons: List<String>?,
    @SerializedName("village") val village: String,
    @SerializedName("sub_center") val subCenter: String,
    @SerializedName("contact_phone") val contactPhone: String
)

data class BeneficiariesResponse(
    @SerializedName("beneficiaries") val beneficiaries: List<BeneficiaryDto>,
    @SerializedName("total") val total: Int
)

// --- CLINICAL EXTRACTION & EVIDENCE ---

data class ExtractRequest(
    @SerializedName("transcript") val transcript: String,
    @SerializedName("language") val language: String = "mr-IN",
    @SerializedName("beneficiary_id") val beneficiaryId: String
)

data class EvidenceSpanDto(
    @SerializedName("field_name") val fieldName: String,
    @SerializedName("extracted_value") val extractedValue: String,
    @SerializedName("start_char") val startChar: Int,
    @SerializedName("end_char") val endChar: Int,
    @SerializedName("source_text") val sourceText: String,
    @SerializedName("confidence") val confidence: Float,
    @SerializedName("status") val status: String
)

data class StructuredRecordDto(
    @SerializedName("record_id") val recordId: String,
    @SerializedName("beneficiary_id") val beneficiaryId: String,
    @SerializedName("beneficiary_name") val beneficiaryName: String,
    @SerializedName("asha_id") val ashaId: String,
    @SerializedName("language") val language: String,
    @SerializedName("transcript") val transcript: String,
    @SerializedName("bp_systolic") val bpSystolic: Int?,
    @SerializedName("bp_diastolic") val bpDiastolic: Int?,
    @SerializedName("weight_kg") val weightKg: Float?,
    @SerializedName("hemoglobin_g_dl") val hemoglobinGDl: Float?,
    @SerializedName("gestational_weeks") val gestationalWeeks: Int?,
    @SerializedName("headache") val headache: Boolean?,
    @SerializedName("pedal_edema") val pedalEdema: Boolean?,
    @SerializedName("fetal_movement_normal") val fetalMovementNormal: Boolean?,
    @SerializedName("evidence_spans") val evidenceSpans: List<EvidenceSpanDto>
)

data class ExtractResponse(
    @SerializedName("structured_record") val structuredRecord: StructuredRecordDto,
    @SerializedName("extracted_spans_count") val extractedSpansCount: Int,
    @SerializedName("warnings_count") val warningsCount: Int
)

// --- SUBMIT VISIT ---

data class CreateVisitRequest(
    @SerializedName("beneficiary_id") val beneficiaryId: String,
    @SerializedName("asha_id") val ashaId: String,
    @SerializedName("language") val language: String,
    @SerializedName("transcript") val transcript: String,
    @SerializedName("audio_duration_seconds") val audioDurationSeconds: Float = 42.0f,
    @SerializedName("bp_systolic") val bpSystolic: Int?,
    @SerializedName("bp_diastolic") val bpDiastolic: Int?,
    @SerializedName("weight_kg") val weightKg: Float?,
    @SerializedName("hemoglobin_g_dl") val hemoglobinGDl: Float?,
    @SerializedName("gestational_weeks") val gestationalWeeks: Int?,
    @SerializedName("headache") val headache: Boolean = false,
    @SerializedName("pedal_edema") val pedalEdema: Boolean = false,
    @SerializedName("fetal_movement_normal") val fetalMovementNormal: Boolean = true,
    @SerializedName("evidence_spans") val evidenceSpans: List<EvidenceSpanDto> = emptyList()
)

data class CreateVisitResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("record_id") val recordId: String,
    @SerializedName("message") val message: String
)

data class VisitRecordItemDto(
    @SerializedName("record_id") val recordId: String,
    @SerializedName("visit_id") val visitId: String,
    @SerializedName("beneficiary_id") val beneficiaryId: String,
    @SerializedName("beneficiary_name") val beneficiaryName: String,
    @SerializedName("asha_id") val ashaId: String,
    @SerializedName("language") val language: String,
    @SerializedName("transcript") val transcript: String,
    @SerializedName("bp_systolic") val bpSystolic: Int?,
    @SerializedName("bp_diastolic") val bpDiastolic: Int?,
    @SerializedName("weight_kg") val weightKg: Float?,
    @SerializedName("hemoglobin_g_dl") val hemoglobinGDl: Float?,
    @SerializedName("gestational_weeks") val gestationalWeeks: Int?,
    @SerializedName("headache") val headache: Boolean?,
    @SerializedName("pedal_edema") val pedalEdema: Boolean?,
    @SerializedName("fetal_movement_normal") val fetalMovementNormal: Boolean?,
    @SerializedName("is_confirmed_by_asha") val isConfirmedByAsha: Boolean,
    @SerializedName("confirmed_at") val confirmedAt: String,
    @SerializedName("anm_review_status") val anmReviewStatus: String,
    @SerializedName("anm_review_notes") val anmReviewNotes: String?,
    @SerializedName("evidence_spans") val evidenceSpans: List<EvidenceSpanDto>
)

data class VisitsListResponse(
    @SerializedName("records") val records: List<VisitRecordItemDto>,
    @SerializedName("total") val total: Int
)
