package com.visitrecord.app.ui.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Onboarding : Screen("onboarding")
    object Login : Screen("login")
    object Language : Screen("language")
    object Home : Screen("home")
    object BeneficiaryList : Screen("beneficiary_list")
    object BeneficiaryProfile : Screen("beneficiary_profile/{beneficiaryId}") {
        fun createRoute(beneficiaryId: String) = "beneficiary_profile/$beneficiaryId"
    }
    object VoiceRecording : Screen("voice_recording")
    object TranscriptionReview : Screen("transcription_review")
    object StructuredRecord : Screen("structured_record")
    object EvidenceReview : Screen("evidence_review")
    object Validation : Screen("validation")
    object Confirmation : Screen("confirmation")
    object VisitHistory : Screen("visit_history")
    object Settings : Screen("settings")
}
