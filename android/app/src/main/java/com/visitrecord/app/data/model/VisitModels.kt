package com.visitrecord.app.data.model

enum class ExtractionStatus {
    EXTRACTED,
    MISSING,
    AMBIGUOUS,
    REQUIRES_VERIFICATION,
    CONCERNING
}

data class EvidenceSpan(
    val fieldName: String,
    val extractedValue: String,
    val startChar: Int,
    val endChar: Int,
    val sourceText: String,
    val confidence: Float,
    val status: ExtractionStatus
)

data class ExtractedField(
    val value: String?,
    val unit: String? = null,
    val supportingPhrase: String? = null,
    val status: ExtractionStatus = ExtractionStatus.MISSING,
    val confidence: Float? = null,
    val isVerified: Boolean = false
)

data class Beneficiary(
    val id: String,
    val name: String,
    val nameMr: String,
    val age: Int,
    val village: String,
    val subCenter: String,
    val category: String,
    val gestationalWeeks: Int? = null,
    val isHighRisk: Boolean = false,
    val rchId: String,
    val contactPhone: String
)

data class VisitRecord(
    val recordId: String,
    val beneficiaryId: String,
    val beneficiaryName: String,
    val ashaId: String,
    val ashaName: String,
    val language: String, // "mr-IN" or "hi-IN"
    val transcript: String,
    val recordedAt: String,
    val bpSystolic: Int?,
    val bpDiastolic: Int?,
    val weightKg: Float?,
    val hemoglobinGDl: Float?,
    val gestationalWeeks: Int?,
    val headacheReported: Boolean,
    val swellingReported: Boolean,
    val fetalMovementsNormal: Boolean,
    val ifaTabletsGiven: Boolean,
    val referralFacility: String?,
    val evidenceSpans: List<EvidenceSpan>,
    val isConfirmedByAsha: Boolean = false,
    val anmReviewStatus: String = "pending"
)

data class AshaUserProfile(
    val id: String = "ASHA-PUN-041",
    val name: String = "रुक्मिणी जाधव",
    val phone: String = "+91 98221 45012",
    val subCenter: String = "खेड शिवापूर उपकेंद्र",
    val phc: String = "खेड शिवापूर प्रा.आ.केंद्र, पुणे",
    val selectedLanguage: String = "mr"
)
