package com.visitrecord.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.visitrecord.app.data.model.AshaUserProfile
import com.visitrecord.app.ui.navigation.Screen
import com.visitrecord.app.ui.screens.*
import com.visitrecord.app.ui.theme.MainBackground
import com.visitrecord.app.ui.theme.VisitRecordTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VisitRecordTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MainBackground
                ) {
                    AppNavigation()
                }
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    var userProfile by remember { mutableStateOf(AshaUserProfile()) }

    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onGetStarted = { navController.navigate(Screen.Onboarding.route) }
            )
        }
        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onContinue = { navController.navigate(Screen.Login.route) }
            )
        }
        composable(Screen.Login.route) {
            LoginScreen(
                currentUser = userProfile,
                onLoginSuccess = { updatedUser ->
                    userProfile = updatedUser
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }
        composable(Screen.Language.route) {
            LanguageScreen(
                currentLanguage = userProfile.selectedLanguage,
                onLanguageSelected = { lang ->
                    userProfile = userProfile.copy(selectedLanguage = lang)
                    navController.popBackStack()
                }
            )
        }
        composable(Screen.Home.route) {
            AshaDashboardScreen(
                userProfile = userProfile,
                onNavigateToRecord = { navController.navigate(Screen.VoiceRecording.route) },
                onNavigateToBeneficiaries = { navController.navigate(Screen.BeneficiaryList.route) },
                onNavigateToHistory = { navController.navigate(Screen.VisitHistory.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                onNavigateToBeneficiaryProfile = { beneficiaryId ->
                    navController.navigate(Screen.BeneficiaryProfile.createRoute(beneficiaryId))
                }
            )
        }
        composable(Screen.BeneficiaryList.route) {
            BeneficiaryListScreen(
                onSelectBeneficiary = { beneficiaryId ->
                    navController.navigate(Screen.BeneficiaryProfile.createRoute(beneficiaryId))
                },
                onBack = { navController.popBackStack() }
            )
        }
        composable(
            route = Screen.BeneficiaryProfile.route,
            arguments = listOf(
                navArgument("beneficiaryId") {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val beneficiaryId = backStackEntry.arguments?.getString("beneficiaryId") ?: ""
            BeneficiaryProfileScreen(
                beneficiaryId = beneficiaryId,
                onNavigateToRecord = { _ ->
                    navController.navigate(Screen.VoiceRecording.route)
                },
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.VoiceRecording.route) {
            VoiceRecordingScreen(
                onFinishRecording = { navController.navigate(Screen.TranscriptionReview.route) },
                onCancel = { navController.popBackStack() }
            )
        }
        composable(Screen.TranscriptionReview.route) {
            TranscriptionReviewScreen(
                onExtractAI = { navController.navigate(Screen.StructuredRecord.route) },
                onReRecord = { navController.navigate(Screen.VoiceRecording.route) }
            )
        }
        composable(Screen.StructuredRecord.route) {
            StructuredRecordScreen(
                onReviewEvidence = { navController.navigate(Screen.EvidenceReview.route) },
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.EvidenceReview.route) {
            EvidenceReviewScreen(
                onConfirm = { navController.navigate(Screen.Validation.route) },
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.Validation.route) {
            ValidationScreen(
                onFinalSubmit = { navController.navigate(Screen.Confirmation.route) },
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.Confirmation.route) {
            ConfirmationScreen(
                onGoHome = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                },
                onViewHistory = { navController.navigate(Screen.VisitHistory.route) }
            )
        }
        composable(Screen.VisitHistory.route) {
            VisitHistoryScreen(
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.Settings.route) {
            SettingsScreen(
                userProfile = userProfile,
                onNavigateLanguage = { navController.navigate(Screen.Language.route) },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onBack = { navController.popBackStack() }
            )
        }
    }
}
