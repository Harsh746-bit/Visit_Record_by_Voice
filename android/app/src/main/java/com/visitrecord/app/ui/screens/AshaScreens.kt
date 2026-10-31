package com.visitrecord.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import com.visitrecord.app.data.local.DraftVisit
import com.visitrecord.app.data.remote.CreateVisitRequest
import com.visitrecord.app.data.remote.EvidenceSpanDto
import com.visitrecord.app.data.repository.AppRepository
import kotlinx.coroutines.launch
import com.visitrecord.app.R
import com.visitrecord.app.data.model.AshaUserProfile
import com.visitrecord.app.data.model.Beneficiary
import com.visitrecord.app.ui.theme.*

// -------------------------------------------------------------
// 1. SPLASH SCREEN (with official logo)
// -------------------------------------------------------------
@Composable
fun SplashScreen(
    onGetStarted: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFF065A63), PrimaryText)))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(modifier = Modifier.height(30.dp))

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Surface(
                modifier = Modifier
                    .size(140.dp)
                    .clip(RoundedCornerShape(32.dp)),
                color = Color.White,
                shadowElevation = 12.dp
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "Visit Record Logo",
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp)
                )
            }

            Text(
                text = "Visit Record by Voice",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Surface(
                shape = RoundedCornerShape(20.dp),
                color = SecondaryGreen.copy(alpha = 0.25f),
                border = androidx.compose.foundation.BorderStroke(1.dp, SecondaryGreen.copy(alpha = 0.5f))
            ) {
                Text(
                    text = "बोल. पडताळा. नोंदवा.",
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            Text(
                text = "महाराष्ट्र शासन आरोग्य सेवा\nFrontline Voice Documentation Platform for ASHA Workers",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.8f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 24.dp)
            )
        }

        Button(
            onClick = onGetStarted,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "सुरू करा • Get Started",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null)
            }
        }
    }
}

// -------------------------------------------------------------
// 2. ONBOARDING SCREEN (3 Steps with logo)
// -------------------------------------------------------------
@Composable
fun OnboardingScreen(
    onContinue: () -> Unit
) {
    var step by remember { mutableStateOf(1) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(48.dp),
                shape = RoundedCornerShape(12.dp),
                color = Color.White,
                shadowElevation = 2.dp
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "Logo",
                    modifier = Modifier.padding(4.dp)
                )
            }
            TextButton(onClick = onContinue) {
                Text("Skip", color = SecondaryText, fontWeight = FontWeight.SemiBold)
            }
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Surface(
                modifier = Modifier.size(90.dp),
                shape = CircleShape,
                color = when (step) {
                    1 -> PrimaryTealContainer
                    2 -> Color(0xFFE6F4EA)
                    else -> Color(0xFFFEF7E0)
                }
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = when (step) {
                            1 -> Icons.Default.Mic
                            2 -> Icons.Default.Assignment
                            else -> Icons.Default.CheckCircle
                        },
                        contentDescription = null,
                        modifier = Modifier.size(44.dp),
                        tint = when (step) {
                            1 -> PrimaryTeal
                            2 -> SecondaryGreen
                            else -> WarningAmber
                        }
                    )
                }
            }

            Text(
                text = when (step) {
                    1 -> "१. नैसर्गिकरीत्या बोला"
                    2 -> "२. AI अचूक नोंद तयार करेल"
                    else -> "३. पडताळा व खात्री करा"
                },
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = PrimaryText,
                textAlign = TextAlign.Center
            )

            Text(
                text = when (step) {
                    1 -> "मराठी किंवा हिंदीत घरभेटीचे वर्णन करा. वैद्यकीय शब्द उदा. बीपी, हिमोग्लोबिन नैसर्गिकरीत्या बोला."
                    2 -> "Sarvam Saaras द्वारे आवाज मजकुरात बदलेल आणि प्रत्येक निष्कर्षाचा मूळ वाक्याशी थेट पुरावा जोडला जाईल."
                    else -> "सर्व माहिती तपासून ANM कडे एका क्लिकवर पाठवा. कोणताही खोटा डेटा तयार होणार नाही."
                },
                style = MaterialTheme.typography.bodyMedium,
                color = SecondaryText,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            // Step dots
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(1, 2, 3).forEach { index ->
                    Box(
                        modifier = Modifier
                            .height(8.dp)
                            .width(if (step == index) 24.dp else 8.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(if (step == index) PrimaryTeal else BorderColor)
                    )
                }
            }
        }

        Button(
            onClick = {
                if (step < 3) step++ else onContinue()
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
        ) {
            Text(
                text = if (step < 3) "पुढे जा • Next" else "लॉगिन करा • Go to Login",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// -------------------------------------------------------------
// 3. DYNAMIC LOGIN SCREEN (Interactive user input + Demo Profiles)
// -------------------------------------------------------------
@Composable
fun LoginScreen(
    currentUser: AshaUserProfile,
    onLoginSuccess: (AshaUserProfile) -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    val coroutineScope = rememberCoroutineScope()

    var name by remember { mutableStateOf(currentUser.name) }
    var phone by remember { mutableStateOf("+91 98810 99401") }
    var subCenter by remember { mutableStateOf(currentUser.subCenter) }
    var pin by remember { mutableStateOf("Asha@1234") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var serverUrl by remember { mutableStateOf(repository.getTokenManager().getServerUrl()) }
    var showServerConfig by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(10.dp))

        // Official App Logo
        Surface(
            modifier = Modifier
                .size(100.dp)
                .clip(RoundedCornerShape(24.dp)),
            color = Color.White,
            shadowElevation = 6.dp
        ) {
            Image(
                painter = painterResource(id = R.drawable.app_logo),
                contentDescription = "Logo",
                modifier = Modifier.fillMaxSize().padding(8.dp)
            )
        }

        Text(
            text = "आशा सेविका लॉगिन",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = PrimaryText
        )

        Text(
            text = "तुमची माहिती प्रविष्ट करा किंवा खालील प्रोफाइल निवडा",
            style = MaterialTheme.typography.bodySmall,
            color = SecondaryText,
            textAlign = TextAlign.Center
        )

        if (errorMessage != null) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFFFEBEE),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE57373))
            ) {
                Text(
                    text = errorMessage!!,
                    color = Color(0xFFC62828),
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(12.dp),
                    textAlign = TextAlign.Center
                )
            }
        }

        // Quick Demo Profile Selector Chips
        Text(
            text = "झटपट डेमो प्रोफाइल (Quick Select):",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = PrimaryTeal,
            modifier = Modifier.align(Alignment.Start)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Surface(
                modifier = Modifier
                    .weight(1f)
                    .clickable {
                        name = "रुक्मिणी जाधव"
                        phone = "+91 98810 99401"
                        subCenter = "खेड शिवापूर उपकेंद्र, पुणे"
                        pin = "Asha@1234"
                    },
                shape = RoundedCornerShape(12.dp),
                color = if (phone.contains("98810")) PrimaryTealContainer else Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, if (phone.contains("98810")) PrimaryTeal else BorderColor)
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Text("रुक्मिणी जाधव", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelMedium, color = PrimaryText)
                    Text("खेड शिवापूर (पुणे)", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                }
            }

            Surface(
                modifier = Modifier
                    .weight(1f)
                    .clickable {
                        name = "सुरेखा मोरे"
                        phone = "+91 94220 88219"
                        subCenter = "त्र्यंबकेश्वर उपकेंद्र, नाशिक"
                        pin = "Asha@1234"
                    },
                shape = RoundedCornerShape(12.dp),
                color = if (phone.contains("88219")) PrimaryTealContainer else Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, if (phone.contains("88219")) PrimaryTeal else BorderColor)
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Text("सुरेखा मोरे", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelMedium, color = PrimaryText)
                    Text("त्र्यंबकेश्वर (नाशिक)", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                }
            }
        }

        HorizontalDivider(color = BorderColor)

        // Editable Input Fields
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("आशा सेविकेचे नाव (Worker Name)") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = PrimaryTeal) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimaryTeal,
                unfocusedBorderColor = BorderColor
            )
        )

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("मोबाईल क्रमांक / ASHA ID") },
            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = PrimaryTeal) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimaryTeal,
                unfocusedBorderColor = BorderColor
            )
        )

        OutlinedTextField(
            value = subCenter,
            onValueChange = { subCenter = it },
            label = { Text("उपकेंद्र / गाव (Sub-Center / Village)") },
            leadingIcon = { Icon(Icons.Default.Place, contentDescription = null, tint = PrimaryTeal) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimaryTeal,
                unfocusedBorderColor = BorderColor
            )
        )

        OutlinedTextField(
            value = pin,
            onValueChange = { pin = it },
            label = { Text("सुरक्षा पिन / पासवर्ड (Password)") },
            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = PrimaryTeal) },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimaryTeal,
                unfocusedBorderColor = BorderColor
            )
        )

        // Backend Server URL Configuration toggle
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "सर्व्हर कॉन्फिगरेशन (Backend Server)",
                style = MaterialTheme.typography.labelSmall,
                color = SecondaryText
            )
            TextButton(onClick = { showServerConfig = !showServerConfig }) {
                Text(
                    text = if (showServerConfig) "लपवा" else "बदला",
                    style = MaterialTheme.typography.labelSmall,
                    color = PrimaryTeal
                )
            }
        }

        if (showServerConfig) {
            OutlinedTextField(
                value = serverUrl,
                onValueChange = {
                    serverUrl = it
                    repository.getTokenManager().setServerUrl(it)
                },
                label = { Text("FastAPI Server URL (Default: 10.0.2.2:8000)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = {
                isLoading = true
                errorMessage = null
                repository.getTokenManager().setServerUrl(serverUrl)

                coroutineScope.launch {
                    val result = repository.login(phone, pin)
                    isLoading = false
                    result.onSuccess { userDto ->
                        val updated = currentUser.copy(
                            id = userDto.id,
                            name = userDto.fullNameMr ?: userDto.fullName,
                            phone = userDto.phone,
                            subCenter = userDto.subCenter ?: subCenter,
                            phc = userDto.phc ?: currentUser.phc
                        )
                        onLoginSuccess(updated)
                    }.onFailure { error ->
                        val isOffline = error.message?.contains("failed to connect", ignoreCase = true) == true ||
                                        error.message?.contains("connect", ignoreCase = true) == true ||
                                        error.message?.contains("timeout", ignoreCase = true) == true

                        if (isOffline) {
                            // Offline frontline mode
                            val updated = currentUser.copy(
                                name = name.ifBlank { "रुक्मिणी जाधव" },
                                phone = phone.ifBlank { "+91 98810 99401" },
                                subCenter = subCenter.ifBlank { "खेड शिवापूर उपकेंद्र" }
                            )
                            onLoginSuccess(updated)
                        } else {
                            errorMessage = "प्रमाणीकरण अयशस्वी: ${error.message ?: "अवैध मोबाईल क्रमांक किंवा पासवर्ड."}"
                        }
                    }
                }
            },
            enabled = !isLoading,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
            } else {
                Text(
                    text = "लॉगिन करा • Login",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// -------------------------------------------------------------
// 4. LANGUAGE SELECTION SCREEN
// -------------------------------------------------------------
@Composable
fun LanguageScreen(
    currentLanguage: String,
    onLanguageSelected: (String) -> Unit
) {
    var selected by remember { mutableStateOf(currentLanguage) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            Icon(Icons.Default.Translate, contentDescription = null, tint = PrimaryTeal, modifier = Modifier.size(56.dp))
            Text(
                text = "तुमची प्रादेशिक भाषा निवडा",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = PrimaryText
            )
            Text(
                text = "Select your preferred regional spoken dialect",
                style = MaterialTheme.typography.bodySmall,
                color = SecondaryText
            )

            Spacer(modifier = Modifier.height(12.dp))

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { selected = "mr" },
                shape = RoundedCornerShape(18.dp),
                color = if (selected == "mr") PrimaryTealContainer else Color.White,
                border = androidx.compose.foundation.BorderStroke(2.dp, if (selected == "mr") PrimaryTeal else BorderColor)
            ) {
                Row(
                    modifier = Modifier.padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("मराठी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = PrimaryText)
                        Text("महाराष्ट्र राज्य अधिकृत भाषा", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    }
                    if (selected == "mr") {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PrimaryTeal)
                    }
                }
            }

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { selected = "hi" },
                shape = RoundedCornerShape(18.dp),
                color = if (selected == "hi") PrimaryTealContainer else Color.White,
                border = androidx.compose.foundation.BorderStroke(2.dp, if (selected == "hi") PrimaryTeal else BorderColor)
            ) {
                Row(
                    modifier = Modifier.padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("हिन्दी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = PrimaryText)
                        Text("राष्ट्रीय भाषा", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    }
                    if (selected == "hi") {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PrimaryTeal)
                    }
                }
            }
        }

        Button(
            onClick = { onLanguageSelected(selected) },
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
        ) {
            Text(
                text = "भाषा निश्चित करा • Save Language",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// -------------------------------------------------------------
// 5. HOME DASHBOARD (Dynamic user name & quick navigation)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AshaDashboardScreen(
    userProfile: AshaUserProfile,
    onNavigateToRecord: () -> Unit,
    onNavigateToBeneficiaries: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToSettings: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            modifier = Modifier.size(40.dp),
                            shape = CircleShape,
                            color = Color.White,
                            shadowElevation = 2.dp
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.app_logo),
                                contentDescription = "Logo",
                                modifier = Modifier.padding(2.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "नमस्ते, ${userProfile.name}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryText
                            )
                            Text(
                                text = userProfile.subCenter,
                                style = MaterialTheme.typography.labelSmall,
                                color = SecondaryText
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings", tint = PrimaryTeal)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                NavigationBarItem(
                    selected = true,
                    onClick = { },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("होम") },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = PrimaryTeal, selectedTextColor = PrimaryTeal)
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToBeneficiaries,
                    icon = { Icon(Icons.Default.Person, contentDescription = "Beneficiaries") },
                    label = { Text("लाभार्थी") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToHistory,
                    icon = { Icon(Icons.Default.ListAlt, contentDescription = "History") },
                    label = { Text("इतिहास") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToSettings,
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("सेटिंग्ज") }
                )
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Stats Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatCard(modifier = Modifier.weight(1f), title = "आजच्या भेटी", count = "८", color = PrimaryText)
                StatCard(modifier = Modifier.weight(1f), title = "पूर्ण", count = "५", color = SecondaryGreen)
                StatCard(modifier = Modifier.weight(1f), title = "प्रलंबित", count = "३", color = WarningAmber)
            }

            // Signature Primary Call-to-Action: Record New Visit
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToRecord() },
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryTeal),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Mic, contentDescription = null, tint = Color.White, modifier = Modifier.size(28.dp))
                        }
                        Column {
                            Text(
                                text = "नवीन भेट नोंदवा",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "मराठी किंवा हिंदीत बोला (Voice AI)",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White.copy(alpha = 0.85f)
                            )
                        }
                    }
                    Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = Color.White)
                }
            }

            // Beneficiary List Header & Queue
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "आजच्या भेटीची यादी (Visit Queue)",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryText
                )
                TextButton(onClick = onNavigateToBeneficiaries) {
                    Text(text = "सर्व पहा", color = PrimaryTeal, fontWeight = FontWeight.Bold)
                }
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    BeneficiaryCard(
                        name = "सुनिता संजय शिंदे",
                        age = 24,
                        village = "खेड शिवापूर",
                        status = "उच्च जोखीम (High Risk)",
                        isHighRisk = true,
                        onClick = onNavigateToRecord
                    )
                }
                item {
                    BeneficiaryCard(
                        name = "पूजा राहुल पाटील",
                        age = 21,
                        village = "वडगाव बुद्रुक",
                        status = "ANC - २८ आठवडे",
                        isHighRisk = false,
                        onClick = onNavigateToRecord
                    )
                }
                item {
                    BeneficiaryCard(
                        name = "कविता रमेश गायकवाड",
                        age = 27,
                        village = "शिवापूर वस्ती",
                        status = "PNC - ६ दिवस",
                        isHighRisk = true,
                        onClick = onNavigateToRecord
                    )
                }
            }
        }
    }
}

// -------------------------------------------------------------
// 6. BENEFICIARY LIST & ADD BENEFICIARY
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BeneficiaryListScreen(
    onSelectBeneficiary: (String) -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    var isLoading by remember { mutableStateOf(false) }

    var searchQuery by remember { mutableStateOf("") }
    var showAddDialog by remember { mutableStateOf(false) }

    var newName by remember { mutableStateOf("") }
    var newAge by remember { mutableStateOf("") }
    var newVillage by remember { mutableStateOf("") }

    val beneficiaries = remember {
        mutableStateListOf(
            Beneficiary("BEN-1", "Sunita Shinde", "सुनिता संजय शिंदे", 24, "खेड शिवापूर", "शिवापूर", "ANC", 28, true, "MH-PUN-0912", "+91 98810 99401"),
            Beneficiary("BEN-2", "Pooja Patil", "पूजा राहुल पाटील", 21, "वडगाव बुद्रुक", "धायरी", "ANC", 16, false, "MH-PUN-1184", "+91 94220 88219"),
            Beneficiary("BEN-3", "Kavita Gaikwad", "कविता रमेश गायकवाड", 27, "शिवापूर वस्ती", "शिवापूर", "PNC", null, true, "MH-PUN-0742", "+91 98500 12345"),
            Beneficiary("BEN-4", "Anita Jadhav", "अनिता विठ्ठल जाधव", 23, "खेड शिवापूर", "शिवापूर", "ANC", 32, false, "MH-PUN-0991", "+91 97654 32100")
        )
    }

    LaunchedEffect(Unit) {
        isLoading = true
        val result = repository.fetchBeneficiaries()
        isLoading = false
        result.onSuccess { dtoList ->
            if (dtoList.isNotEmpty()) {
                beneficiaries.clear()
                dtoList.forEach { dto ->
                    beneficiaries.add(
                        Beneficiary(
                            id = dto.id,
                            name = dto.name,
                            nameMr = dto.nameMr,
                            age = dto.age,
                            village = dto.village,
                            subCenter = dto.subCenter,
                            category = dto.category,
                            gestationalWeeks = dto.gestationalWeeks,
                            isHighRisk = dto.isHighRisk,
                            rchId = dto.rchId,
                            contactPhone = dto.contactPhone
                        )
                    )
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("लाभार्थी यादी (Beneficiaries)", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Default.Add, contentDescription = "Add", tint = PrimaryTeal)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("नाव किंवा गाव शोधा...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SecondaryText) },
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryTeal,
                    unfocusedBorderColor = BorderColor
                )
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                val filtered = beneficiaries.filter {
                    it.nameMr.contains(searchQuery) || it.village.contains(searchQuery)
                }
                items(filtered) { b ->
                    BeneficiaryCard(
                        name = b.nameMr,
                        age = b.age,
                        village = b.village,
                        status = if (b.isHighRisk) "उच्च जोखीम (High Risk)" else "${b.category} - ${b.gestationalWeeks ?: 0} आठवडे",
                        isHighRisk = b.isHighRisk,
                        onClick = { onSelectBeneficiary(b.nameMr) }
                    )
                }
            }
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("नवीन लाभार्थी जोडा", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = newName,
                        onValueChange = { newName = it },
                        label = { Text("मातेचे नाव") }
                    )
                    OutlinedTextField(
                        value = newAge,
                        onValueChange = { newAge = it },
                        label = { Text("वय (Age)") }
                    )
                    OutlinedTextField(
                        value = newVillage,
                        onValueChange = { newVillage = it },
                        label = { Text("गाव / वस्ती") }
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newName.isNotBlank()) {
                            beneficiaries.add(
                                Beneficiary(
                                    id = "BEN-${beneficiaries.size + 1}",
                                    name = newName,
                                    nameMr = newName,
                                    age = newAge.toIntOrNull() ?: 22,
                                    village = newVillage.ifBlank { "खेड शिवापूर" },
                                    subCenter = "शिवापूर उपकेंद्र",
                                    category = "ANC",
                                    gestationalWeeks = 12,
                                    isHighRisk = false,
                                    rchId = "MH-NEW-${System.currentTimeMillis() % 10000}",
                                    contactPhone = "+91 99999 00000"
                                )
                            )
                        }
                        showAddDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
                ) {
                    Text("जोडा (Add)")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("रद्द करा")
                }
            }
        )
    }
}

// -------------------------------------------------------------
// 7. VOICE RECORDING SCREEN
// -------------------------------------------------------------
@Composable
fun VoiceRecordingScreen(
    onFinishRecording: () -> Unit,
    onCancel: () -> Unit
) {
    var seconds by remember { mutableStateOf(14) }

    LaunchedEffect(Unit) {
        while (true) {
            kotlinx.coroutines.delay(1000)
            seconds++
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFF0F3A40), PrimaryText)))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onCancel) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
            }
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color.White.copy(alpha = 0.15f)
            ) {
                Text(
                    text = "भाषा: मराठी (Sarvam Saaras)",
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White
                )
            }
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Text(
                text = "00:${seconds.toString().padStart(2, '0')}",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Row(
                modifier = Modifier.height(48.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                listOf(20, 35, 48, 25, 42, 30, 48, 38, 24, 45, 18).forEach { height ->
                    Box(
                        modifier = Modifier
                            .width(5.dp)
                            .height(height.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(SecondaryGreen)
                    )
                }
            }

            Box(
                modifier = Modifier
                    .size(110.dp)
                    .clip(CircleShape)
                    .background(PrimaryTeal.copy(alpha = 0.4f)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(PrimaryTeal)
                        .clickable { onFinishRecording() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Stop, contentDescription = "Stop", tint = Color.White, modifier = Modifier.size(36.dp))
                }
            }

            Text(
                text = "घरभेटीबद्दल नैसर्गिकरीत्या बोला. मराठी, हिंदी किंवा वैद्यकीय शब्द वापरू शकता.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.8f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 24.dp)
            )
        }

        Button(
            onClick = onFinishRecording,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = SecondaryGreen)
        ) {
            Text(
                text = "रेकॉर्डिंग पूर्ण करा (Finish & Review)",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// -------------------------------------------------------------
// 8. TRANSCRIPTION REVIEW SCREEN (Editable Devanagari Text)
// -------------------------------------------------------------
@Composable
fun TranscriptionReviewScreen(
    onExtractAI: () -> Unit,
    onReRecord: () -> Unit
) {
    var transcriptText by remember {
        mutableStateOf(
            "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. सुनिताचे वय २४ वर्षे असून ती सध्या २८ आठवड्यांची गरोदर आहे. तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे. वजन ५४ किलो आहे. हिमोग्लोबिन १०.२ ग्रॅम भरले. तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे. बाळाची हालचाल व्यवस्थित आहे. मी तिला तातडीने प्राथमिक आरोग्य केंद्रात जाण्यास सांगितले."
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "आवाजाचे रूपांतर (Transcript)",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PrimaryText
            )
            Surface(shape = RoundedCornerShape(8.dp), color = PrimaryTealContainer) {
                Text("Sarvam Saaras v3", modifier = Modifier.padding(6.dp), style = MaterialTheme.typography.labelSmall, color = PrimaryTealDark)
            }
        }

        Text(
            text = "* उच्चार किंवा आवाजातील त्रुटी असल्यास आपण खालील मजकूर दुरुस्त करू शकता:",
            style = MaterialTheme.typography.labelSmall,
            color = SecondaryText
        )

        OutlinedTextField(
            value = transcriptText,
            onValueChange = { transcriptText = it },
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimaryTeal,
                unfocusedBorderColor = BorderColor
            )
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onReRecord,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("पुन्हा रेकॉर्ड करा", fontWeight = FontWeight.SemiBold)
            }

            Button(
                onClick = onExtractAI,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
            ) {
                Text("AI माहिती काढा", fontWeight = FontWeight.Bold)
            }
        }
    }
}

// -------------------------------------------------------------
// 9. STRUCTURED AI FORM (Editable extracted fields)
// -------------------------------------------------------------
@Composable
fun StructuredRecordScreen(
    onReviewEvidence: () -> Unit,
    onBack: () -> Unit
) {
    var bpSystolic by remember { mutableStateOf("140") }
    var bpDiastolic by remember { mutableStateOf("95") }
    var weight by remember { mutableStateOf("54.0") }
    var hb by remember { mutableStateOf("10.2") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
            Text(
                text = "तयार झालेली भेट नोंद (Extracted)",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PrimaryText
            )
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("A. मोजमापे (Vital Signs)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = bpSystolic,
                        onValueChange = { bpSystolic = it },
                        label = { Text("BP Systolic") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = bpDiastolic,
                        onValueChange = { bpDiastolic = it },
                        label = { Text("BP Diastolic") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = weight,
                        onValueChange = { weight = it },
                        label = { Text("वजन (Weight kg)") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = hb,
                        onValueChange = { hb = it },
                        label = { Text("Hb (g/dL)") },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("B. नोंदवलेली लक्षणे (Symptoms)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                ObservationRow(label = "डोकेदुखी (Severe Headache)", value = "आहे (Reported)", isDanger = true)
                ObservationRow(label = "पायावर सूज (Pedal Edema)", value = "हलकी सूज (Mild)", isDanger = true)
                ObservationRow(label = "बाळाची हालचाल (Fetal Movement)", value = "नॉर्मल (Good)", isDanger = false)
            }
        }

        Button(
            onClick = onReviewEvidence,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
        ) {
            Text(
                text = "पुरावा पडताळा • Review Evidence",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// -------------------------------------------------------------
// 10. EVIDENCE REVIEW SCREEN (Traceability)
// -------------------------------------------------------------
@Composable
fun EvidenceReviewScreen(
    onConfirm: () -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimaryText)
            }
            Text(
                text = "पुरावा पडताळणी (Evidence)",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PrimaryText
            )
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
        ) {
            Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "फील्ड: रक्तदाब (Blood Pressure)", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Surface(shape = RoundedCornerShape(8.dp), color = DangerContainer) {
                        Text(text = "१४०/९५ mmHg", modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), color = DangerRed, fontWeight = FontWeight.Bold)
                    }
                }

                Text(
                    text = "आवाजातील मूळ वाक्य (Supporting Transcript):",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText
                )

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = PrimaryTealContainer.copy(alpha = 0.5f),
                    border = androidx.compose.foundation.BorderStroke(1.dp, PrimaryTeal.copy(alpha = 0.3f))
                ) {
                    Text(
                        text = "\"तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे.\"",
                        modifier = Modifier.padding(12.dp),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = PrimaryTealDark
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SecondaryGreen, modifier = Modifier.size(16.dp))
                    Text(text = "पुरावा १००% सिद्ध • Traceable Evidence Found", style = MaterialTheme.typography.labelSmall, color = SecondaryGreen)
                }
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = onConfirm,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
        ) {
            Text(
                text = "वैद्यकीय इशारे तपासा • Validate Rules",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// -------------------------------------------------------------
// 11. VALIDATION SCREEN (High-Risk Rules & Warning Triage)
// -------------------------------------------------------------
@Composable
fun ValidationScreen(
    onFinalSubmit: () -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    val coroutineScope = rememberCoroutineScope()
    var isConfirmed by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
            Text(
                text = "वैद्यकीय पडताळणी इशारे",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = PrimaryText
            )
        }

        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            color = DangerContainer,
            border = androidx.compose.foundation.BorderStroke(1.dp, DangerRed.copy(alpha = 0.4f))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Warning, contentDescription = null, tint = DangerRed)
                    Text("उच्च रक्तदाब इशारा (Gestational Hypertension)", fontWeight = FontWeight.Bold, color = DangerRed)
                }
                Text(
                    text = "रक्तदाब १४०/९५ mmHg सामान्य मर्यादेपेक्षा जास्त आहे. मातेला डोकेदुखी व सूज असल्याने त्वरित प्राथमिक आरोग्य केंद्रात (PHC) डॉक्टरांकडे पाठवा.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = PrimaryText
                )
            }
        }

        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFFFEF7E0),
            border = androidx.compose.foundation.BorderStroke(1.dp, WarningAmber.copy(alpha = 0.4f))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = WarningAmber)
                    Text("हिमोग्लोबिन अलर्ट (Mild Anemia)", fontWeight = FontWeight.Bold, color = WarningAmber)
                }
                Text(
                    text = "हिमोग्लोबिन १०.२ g/dL (अपेक्षित: >= ११.० g/dL). आयर्न-फॉलिक ॲसिड गोळ्यांचा नियमित डोस सुरू ठेवा.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = PrimaryText
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .clickable { isConfirmed = !isConfirmed }
        ) {
            Checkbox(
                checked = isConfirmed,
                onCheckedChange = { isConfirmed = it },
                colors = CheckboxDefaults.colors(checkedColor = PrimaryTeal)
            )
            Text(
                text = "मी सर्व माहिती तपासली असून ती खरी व योग्य असल्याची खात्री करत आहे.",
                style = MaterialTheme.typography.bodySmall,
                color = PrimaryText
            )
        }

        Button(
            onClick = {
                isSubmitting = true
                val draftId = "REC-PUN-${System.currentTimeMillis() % 100000}"
                
                // 1. Save locally in SQLite immediately (Offline-First resilience)
                val localDraft = DraftVisit(
                    id = draftId,
                    beneficiaryId = "BEN-MH-PUN-0841",
                    beneficiaryName = "सुनिता संजय शिंदे",
                    language = "mr-IN",
                    transcript = "सुनिता शिंदे, वय २४ वर्षे, २८ आठवडे गरोदर आहेत. रक्तदाब १४०/९५ एवढा जास्त आला आहे आणि डोकेदुखी आहे. वजन ५४ किलो भरले आहे. हिमोग्लोबिन १०.२ ग्रॅम आहे. बाळाची हालचाल व्यवस्थित आहे. त्यांना खेड शिवापूर ग्रामीण रुग्णालयात पाठवले आहे.",
                    bpSystolic = 140,
                    bpDiastolic = 95,
                    weightKg = 54.0f,
                    hemoglobinGDl = 10.2f,
                    gestationalWeeks = 28,
                    headache = true,
                    pedalEdema = true,
                    fetalMovementNormal = true,
                    syncStatus = "SYNC_PENDING"
                )
                repository.saveLocalDraft(localDraft)

                // 2. Dispatch to FastAPI PostgreSQL backend
                coroutineScope.launch {
                    val createReq = CreateVisitRequest(
                        beneficiaryId = "BEN-MH-PUN-0841",
                        ashaId = repository.getTokenManager().getUserId(),
                        language = "mr-IN",
                        transcript = localDraft.transcript,
                        bpSystolic = localDraft.bpSystolic,
                        bpDiastolic = localDraft.bpDiastolic,
                        weightKg = localDraft.weightKg,
                        hemoglobinGDl = localDraft.hemoglobinGDl,
                        gestationalWeeks = localDraft.gestationalWeeks,
                        headache = localDraft.headache,
                        pedalEdema = localDraft.pedalEdema,
                        fetalMovementNormal = localDraft.fetalMovementNormal,
                        evidenceSpans = listOf(
                            EvidenceSpanDto("blood_pressure", "140/95 mmHg", 49, 74, "रक्तदाब १४०/९५ एवढा जास्त आला आहे", 0.98f, "concerning"),
                            EvidenceSpanDto("weight", "54 kg", 96, 113, "वजन ५४ किलो भरले आहे", 0.99f, "extracted"),
                            EvidenceSpanDto("hemoglobin", "10.2 g/dL", 115, 137, "हिमोग्लोबिन १०.२ ग्रॅम आहे", 0.96f, "extracted"),
                            EvidenceSpanDto("headache", "Reported (Severe)", 79, 94, "डोकेदुखी आहे", 0.95f, "concerning")
                        )
                    )
                    repository.submitVisitRecord(createReq, draftId)
                    isSubmitting = false
                    onFinalSubmit()
                }
            },
            enabled = isConfirmed && !isSubmitting,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = SecondaryGreen)
        ) {
            if (isSubmitting) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
            } else {
                Text(
                    text = "अंतिम खात्री व सबमिट करा",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// -------------------------------------------------------------
// 12. CONFIRMATION SCREEN (Success feedback)
// -------------------------------------------------------------
@Composable
fun ConfirmationScreen(
    onGoHome: () -> Unit,
    onViewHistory: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(modifier = Modifier.height(20.dp))

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Surface(
                modifier = Modifier.size(100.dp),
                shape = CircleShape,
                color = SuccessContainer
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.Check, contentDescription = null, tint = SecondaryGreen, modifier = Modifier.size(56.dp))
                }
            }

            Text(
                text = "भेट नोंद यशस्वीरीत्या जतन झाली!",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = PrimaryText,
                textAlign = TextAlign.Center
            )

            Surface(shape = RoundedCornerShape(12.dp), color = Color.White, border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("नोंद क्रमांक (Record ID)", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text("REC-2026-PUN-0914", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = PrimaryTeal)
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderColor)
                    Text("स्थानिक डेटाबेसमध्ये सुरक्षित (Room DB Saved)", style = MaterialTheme.typography.labelSmall, color = SecondaryGreen)
                    Text("ANM पुनरावलोकनासाठी पाठवले गेले", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                }
            }
        }

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Button(
                onClick = onGoHome,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal)
            ) {
                Text("मुख्य पृष्ठावर जा • Home", fontWeight = FontWeight.Bold)
            }

            OutlinedButton(
                onClick = onViewHistory,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("इतिहास पहा • View History", fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

// -------------------------------------------------------------
// 13. VISIT HISTORY SCREEN
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VisitHistoryScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    val localDrafts = remember { mutableStateListOf<DraftVisit>() }

    LaunchedEffect(Unit) {
        localDrafts.clear()
        localDrafts.addAll(repository.getLocalDrafts())
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("मागील भेट नोंदी (History)", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        containerColor = MainBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Live Local SQLite Drafts first
            items(localDrafts) { draft ->
                HistoryRecordCard(
                    patientName = draft.beneficiaryName,
                    date = "स्थानिक नोंद • ${if (draft.syncStatus == "SYNCED") "सर्व्हरवर सिंक पूर्ण" else "सिंक प्रलंबित"}",
                    vitals = "BP: ${draft.bpSystolic}/${draft.bpDiastolic} | Hb: ${draft.hemoglobinGDl ?: "--"} | वजन: ${draft.weightKg ?: "--"} किलो",
                    status = if (draft.syncStatus == "SYNCED") "Synced to PostgreSQL" else "Local Draft (Offline)",
                    isPending = draft.syncStatus != "SYNCED"
                )
            }

            item {
                HistoryRecordCard(
                    patientName = "सुनिता संजय शिंदे",
                    date = "३१ ऑक्टोबर २०२६ • ०९:४० AM",
                    vitals = "BP: १४०/९५ | Hb: १०.२ | वजन: ५४ किलो",
                    status = "Pending ANM Review",
                    isPending = true
                )
            }
            item {
                HistoryRecordCard(
                    patientName = "पूजा राहुल पाटील",
                    date = "३० ऑक्टोबर २०२६ • ०२:१५ PM",
                    vitals = "BP: ११८/७६ | Hb: ११.५ | वजन: ४९ किलो",
                    status = "ANM Approved",
                    isPending = false
                )
            }
            item {
                HistoryRecordCard(
                    patientName = "कविता रमेश गायकवाड",
                    date = "२८ ऑक्टोबर २०२६ • ११:०० AM",
                    vitals = "BP: १३०/८५ | Hb: ९.८ | वजन: ५२ किलो",
                    status = "ANM Approved",
                    isPending = false
                )
            }
        }
    }
}

// -------------------------------------------------------------
// 14. SETTINGS SCREEN (Profile info, language switch, logout)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    userProfile: AshaUserProfile,
    onNavigateLanguage: () -> Unit,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("प्रणाली सेटिंग्ज (Settings)", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Worker Profile Card
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                color = Color.White,
                shadowElevation = 2.dp
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Surface(
                        modifier = Modifier.size(56.dp),
                        shape = CircleShape,
                        color = PrimaryTealContainer
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Person, contentDescription = null, tint = PrimaryTeal, modifier = Modifier.size(32.dp))
                        }
                    }
                    Column {
                        Text(userProfile.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Text(userProfile.phone, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                        Text(userProfile.subCenter, style = MaterialTheme.typography.labelSmall, color = PrimaryTeal)
                    }
                }
            }

            // Options List
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("भाषा बदला (Change Language)") },
                        supportingContent = { Text("मराठी / हिन्दी") },
                        leadingContent = { Icon(Icons.Default.Translate, contentDescription = null, tint = PrimaryTeal) },
                        trailingContent = { Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = SecondaryText) },
                        modifier = Modifier.clickable { onNavigateLanguage() }
                    )
                    HorizontalDivider(color = BorderColor)
                    ListItem(
                        headlineContent = { Text("आवाज ओळख इंजिन (ASR Engine)") },
                        supportingContent = { Text("Sarvam Saaras v3 Indic") },
                        leadingContent = { Icon(Icons.Default.Mic, contentDescription = null, tint = SecondaryGreen) }
                    )
                    HorizontalDivider(color = BorderColor)
                    ListItem(
                        headlineContent = { Text("ऑफलाइन डेटाबेस (Local Storage)") },
                        supportingContent = { Text("Room Database Cache • Synced") },
                        leadingContent = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SecondaryGreen) }
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            val context = LocalContext.current
            Button(
                onClick = {
                    AppRepository(context).getTokenManager().clearSession()
                    onLogout()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = DangerRed)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Close, contentDescription = null)
                    Text("लॉग आऊट / वापरकर्ता बदला (Logout)", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// -------------------------------------------------------------
// HELPER COMPONENTS
// -------------------------------------------------------------
@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    title: String,
    count: String,
    color: Color
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(text = title, style = MaterialTheme.typography.labelSmall, color = SecondaryText)
            Text(text = count, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = color)
        }
    }
}

@Composable
fun BeneficiaryCard(
    name: String,
    age: Int,
    village: String,
    status: String,
    isHighRisk: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Surface(
                    modifier = Modifier.size(46.dp),
                    shape = CircleShape,
                    color = if (isHighRisk) DangerContainer else PrimaryTealContainer
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(
                            text = "${age}y",
                            fontWeight = FontWeight.Bold,
                            color = if (isHighRisk) DangerRed else PrimaryTealDark,
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }
                Column {
                    Text(text = name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = PrimaryText)
                    Text(text = village, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                }
            }

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = if (isHighRisk) DangerContainer else SuccessContainer
            ) {
                Text(
                    text = status,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = if (isHighRisk) DangerRed else SuccessGreen
                )
            }
        }
    }
}

@Composable
fun ObservationRow(label: String, value: String, isDanger: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium, color = PrimaryText)
        Surface(
            shape = RoundedCornerShape(8.dp),
            color = if (isDanger) DangerContainer else SuccessContainer
        ) {
            Text(
                text = value,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = if (isDanger) DangerRed else SuccessGreen
            )
        }
    }
}

@Composable
fun HistoryRecordCard(
    patientName: String,
    date: String,
    vitals: String,
    status: String,
    isPending: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(patientName, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (isPending) Color(0xFFFEF7E0) else SuccessContainer
                ) {
                    Text(
                        text = status,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = if (isPending) WarningAmber else SuccessGreen
                    )
                }
            }
            Text(vitals, style = MaterialTheme.typography.bodySmall, color = PrimaryText)
            Text(date, style = MaterialTheme.typography.labelSmall, color = SecondaryText)
        }
    }
}
