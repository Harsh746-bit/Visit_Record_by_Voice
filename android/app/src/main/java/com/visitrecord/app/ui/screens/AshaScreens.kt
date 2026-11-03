package com.visitrecord.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.visitrecord.app.R
import com.visitrecord.app.data.local.DraftVisit
import com.visitrecord.app.data.model.AshaUserProfile
import com.visitrecord.app.data.model.Beneficiary
import com.visitrecord.app.data.remote.CreateVisitRequest
import com.visitrecord.app.data.remote.EvidenceSpanDto
import com.visitrecord.app.data.repository.AppRepository
import com.visitrecord.app.ui.components.*
import com.visitrecord.app.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// -------------------------------------------------------------
// 1. SPLASH SCREEN (Maharashtra Public Health Department Branding)
// -------------------------------------------------------------
@Composable
fun SplashScreen(
    onGetStarted: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        PrimaryTealDark,
                        Color(0xFF0A5863),
                        PrimaryText
                    )
                )
            )
            .padding(28.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Government Badge Header
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color.White.copy(alpha = 0.12f),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.25f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = "महाराष्ट्र शासन • सार्वजनिक आरोग्य विभाग",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                }
            }
        }

        // Center Hero Logo & Title
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Surface(
                modifier = Modifier
                    .size(130.dp)
                    .clip(RoundedCornerShape(32.dp)),
                color = Color.White,
                shadowElevation = 14.dp
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "Visit Record Logo",
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(14.dp)
                )
            }

            Text(
                text = "Visit Record by Voice",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
            )

            // Tagline Pill
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = SecondaryGreen.copy(alpha = 0.25f),
                border = androidx.compose.foundation.BorderStroke(1.5.dp, SecondaryGreen)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 18.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Mic,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = "बोल. पडताळा. नोंदवा.",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }

            Text(
                text = "आरोग्य सेविका व्हॉइस डॉक्युमेंटेशन प्लॅटफॉर्म\nFrontline AI Clinical Documentation for ASHA & ANM",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.85f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }

        // Bottom CTA
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            PrimaryButton(
                text = "सुरू करा • Get Started",
                onClick = onGetStarted,
                trailingIcon = Icons.AutoMirrored.Filled.ArrowForward,
                containerColor = PrimaryTeal
            )

            Text(
                text = "Secure • Offline First • Sarvam Saaras AI",
                style = MaterialTheme.typography.labelSmall,
                color = Color.White.copy(alpha = 0.6f)
            )
        }
    }
}

// -------------------------------------------------------------
// 2. ONBOARDING SCREEN (3 Modern Guided Steps)
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
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(46.dp),
                shape = RoundedCornerShape(12.dp),
                color = Color.White,
                shadowElevation = 2.dp
            ) {
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "Logo",
                    modifier = Modifier.padding(6.dp)
                )
            }
            TextButton(onClick = onContinue) {
                Text("Skip", color = SecondaryText, fontWeight = FontWeight.SemiBold)
            }
        }

        // Step Content Card
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Surface(
                modifier = Modifier.size(92.dp),
                shape = CircleShape,
                color = when (step) {
                    1 -> PrimaryTealContainer
                    2 -> SecondaryGreenContainer
                    else -> WarningContainer
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
                    1 -> "मराठी किंवा हिंदीत घरभेटीचे वर्णन करा. बीपी, हिमोग्लोबिन, सूज, गर्भाचे आठवडे नैसर्गिक आवाजात नोंदवा."
                    2 -> "Sarvam Saaras द्वारे आवाज मजकुरात बदलेल आणि प्रत्येक वैद्यकीय निष्कर्षाचा मूळ वाक्याशी थेट पुरावा जोडला जाईल."
                    else -> "माहिती तपासून ANM कडे एका क्लिकवर पाठवा. मानवी नियंत्रणाखाली अचूक डिजिटल नोंद."
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
                            .width(if (step == index) 28.dp else 8.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(if (step == index) PrimaryTeal else BorderColor)
                    )
                }
            }
        }

        // Bottom Actions
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            PrimaryButton(
                text = if (step < 3) "पुढे जा • Next" else "लॉगिन करा • Go to Login",
                onClick = {
                    if (step < 3) step++ else onContinue()
                },
                trailingIcon = if (step < 3) Icons.AutoMirrored.Filled.ArrowForward else null
            )

            if (step > 1) {
                SecondaryButton(
                    text = "मागे • Back",
                    onClick = { step-- }
                )
            }
        }
    }
}

// -------------------------------------------------------------
// 3. DYNAMIC LOGIN SCREEN (Password & Real OTP Authentication)
// -------------------------------------------------------------
@Composable
fun LoginScreen(
    currentUser: AshaUserProfile,
    onLoginSuccess: (AshaUserProfile) -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    val coroutineScope = rememberCoroutineScope()
    val tokenManager = repository.getTokenManager()
    val isProd = tokenManager.isProductionMode()

    var loginMode by remember { mutableIntStateOf(0) } // 0: Password, 1: OTP
    var name by remember { mutableStateOf(if (isProd) "" else currentUser.name) }
    var phone by remember { mutableStateOf(if (isProd) "" else "+91 98810 99401") }
    var subCenter by remember { mutableStateOf(if (isProd) "" else currentUser.subCenter) }
    var pin by remember { mutableStateOf(if (isProd) "" else "Asha#98!Rukmini") }
    var passwordVisible by remember { mutableStateOf(false) }

    // OTP states
    var otpValue by remember { mutableStateOf("") }
    var otpSent by remember { mutableStateOf(false) }
    var testModeOtp by remember { mutableStateOf<String?>(null) }
    var resendCooldown by remember { mutableIntStateOf(0) }

    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var serverUrl by remember { mutableStateOf(repository.getTokenManager().getServerUrl()) }
    var showServerConfig by remember { mutableStateOf(false) }

    // Countdown effect for OTP resend
    LaunchedEffect(resendCooldown) {
        if (resendCooldown > 0) {
            delay(1000)
            resendCooldown--
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Spacer(modifier = Modifier.height(6.dp))

        // Official App Logo
        Surface(
            modifier = Modifier
                .size(96.dp)
                .clip(RoundedCornerShape(24.dp)),
            color = Color.White,
            shadowElevation = 6.dp
        ) {
            Image(
                painter = painterResource(id = R.drawable.app_logo),
                contentDescription = "Logo",
                modifier = Modifier
                    .fillMaxSize()
                    .padding(8.dp)
            )
        }

        Text(
            text = "आशा सेविका लॉगिन",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = PrimaryText
        )

        Text(
            text = "महाराष्ट्र आरोग्य सेवा • Frontline Worker Portal",
            style = MaterialTheme.typography.bodySmall,
            color = SecondaryText,
            textAlign = TextAlign.Center
        )

        // Production Mode Banner vs Dev Banner
        if (isProd) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFE8F5E9),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784))
            ) {
                Text(
                    text = "🔒 उत्पादन मोड • Production Mode (Real Credentials Required)",
                    color = Color(0xFF2E7D32),
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(12.dp),
                    textAlign = TextAlign.Center
                )
            }
        }

        // Login Mode Selector Tabs: Password vs OTP
        TabRow(
            selectedTabIndex = loginMode,
            containerColor = Color.White,
            contentColor = PrimaryTeal,
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
        ) {
            Tab(
                selected = loginMode == 0,
                onClick = {
                    loginMode = 0
                    errorMessage = null
                },
                text = {
                    Text(
                        "पासवर्ड लॉगिन",
                        fontWeight = if (loginMode == 0) FontWeight.Bold else FontWeight.Normal,
                        color = if (loginMode == 0) PrimaryTeal else SecondaryText
                    )
                }
            )
            Tab(
                selected = loginMode == 1,
                onClick = {
                    loginMode = 1
                    errorMessage = null
                },
                text = {
                    Text(
                        "OTP लॉगिन (SMS)",
                        fontWeight = if (loginMode == 1) FontWeight.Bold else FontWeight.Normal,
                        color = if (loginMode == 1) PrimaryTeal else SecondaryText
                    )
                }
            )
        }

        if (errorMessage != null) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = DangerContainer,
                border = androidx.compose.foundation.BorderStroke(1.dp, DangerRed.copy(alpha = 0.5f))
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Warning, contentDescription = null, tint = DangerRed, modifier = Modifier.size(18.dp))
                    Text(
                        text = errorMessage!!,
                        color = DangerRed,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }

        // Quick Demo Profile Selector (Development Mode Only)
        if (!isProd) {
            Text(
                text = "झटपट डेमो प्रोफाइल (Development Mode):",
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
                            pin = "Asha#98!Rukmini"
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
                            pin = "Asha#94!Surekha"
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
        }

        // Common Mobile Number Field
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("मोबाईल क्रमांक (Mobile Number)") },
            leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = PrimaryTeal) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimaryTeal,
                unfocusedBorderColor = BorderColor
            )
        )

        if (loginMode == 0) {
            // PASSWORD MODE FIELDS
            OutlinedTextField(
                value = pin,
                onValueChange = { pin = it },
                label = { Text("पासवर्ड / सुरक्षा पिन (Password)") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = PrimaryTeal) },
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                            contentDescription = if (passwordVisible) "Hide password" else "Show password",
                            tint = SecondaryText
                        )
                    }
                },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryTeal,
                    unfocusedBorderColor = BorderColor
                )
            )

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
        } else {
            // OTP MODE FIELDS
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = otpValue,
                    onValueChange = { if (it.length <= 6) otpValue = it },
                    label = { Text("६-अंकी OTP (6-Digit OTP)") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = PrimaryTeal) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryTeal,
                        unfocusedBorderColor = BorderColor
                    )
                )

                Button(
                    onClick = {
                        isLoading = true
                        errorMessage = null
                        repository.getTokenManager().setServerUrl(serverUrl)

                        coroutineScope.launch {
                            val result = repository.sendOtp(phone)
                            isLoading = false
                            result.onSuccess { resp ->
                                otpSent = true
                                resendCooldown = 60
                                if (resp.testModeOtp != null) {
                                    testModeOtp = resp.testModeOtp
                                }
                            }.onFailure { err ->
                                errorMessage = "OTP पाठवता आला नाही: ${err.message}"
                            }
                        }
                    },
                    enabled = !isLoading && resendCooldown == 0 && phone.isNotBlank(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal),
                    modifier = Modifier.height(54.dp)
                ) {
                    Text(
                        text = if (resendCooldown > 0) "${resendCooldown}s" else if (otpSent) "पुन्हा पाठवा" else "OTP मिळवा",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            if (testModeOtp != null) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { otpValue = testModeOtp ?: "" },
                    shape = RoundedCornerShape(10.dp),
                    color = PrimaryTealContainer,
                    border = androidx.compose.foundation.BorderStroke(1.dp, PrimaryTeal)
                ) {
                    Row(
                        modifier = Modifier.padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "डेमो OTP: $testModeOtp (क्लिक करून भरा)",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryTealDark
                        )
                        Icon(Icons.Default.Check, contentDescription = null, tint = PrimaryTeal, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }

        // Server URL toggle
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

        Spacer(modifier = Modifier.height(4.dp))

        // Main Login / Verify Button
        PrimaryButton(
            text = if (loginMode == 0) "लॉगिन करा • Login" else "OTP तपासा व लॉगिन करा • Verify OTP",
            onClick = {
                isLoading = true
                errorMessage = null
                repository.getTokenManager().setServerUrl(serverUrl)

                coroutineScope.launch {
                    if (loginMode == 0) {
                        // Password Login
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
                            val isOffline = error.message?.contains("connect", ignoreCase = true) == true ||
                                            error.message?.contains("timeout", ignoreCase = true) == true

                            if (isOffline && !isProd) {
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
                    } else {
                        // OTP Verification
                        val result = repository.verifyOtp(phone, otpValue)
                        isLoading = false
                        result.onSuccess {
                            val updated = currentUser.copy(
                                phone = phone,
                                name = name.ifBlank { "रुक्मिणी जाधव" },
                                subCenter = subCenter.ifBlank { "खेड शिवापूर उपकेंद्र" }
                            )
                            onLoginSuccess(updated)
                        }.onFailure { err ->
                            errorMessage = "OTP प्रमाणीकरण अयशस्वी: ${err.message}"
                        }
                    }
                }
            },
            isLoading = isLoading,
            enabled = if (loginMode == 0) phone.isNotBlank() && pin.isNotBlank() else phone.isNotBlank() && otpValue.length >= 4
        )
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
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            Surface(
                modifier = Modifier.size(72.dp),
                shape = CircleShape,
                color = PrimaryTealContainer
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        Icons.Default.Translate,
                        contentDescription = null,
                        tint = PrimaryTeal,
                        modifier = Modifier.size(38.dp)
                    )
                }
            }

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

            Spacer(modifier = Modifier.height(8.dp))

            // Marathi Card
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
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("मराठी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = PrimaryText)
                        Text("महाराष्ट्र राज्य अधिकृत भाषा • Marathi (Default)", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    }
                    if (selected == "mr") {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PrimaryTeal, modifier = Modifier.size(24.dp))
                    }
                }
            }

            // Hindi Card
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
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("हिन्दी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = PrimaryText)
                        Text("राष्ट्रीय भाषा • Hindi Regional Dialect", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    }
                    if (selected == "hi") {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PrimaryTeal, modifier = Modifier.size(24.dp))
                    }
                }
            }
        }

        PrimaryButton(
            text = "भाषा निश्चित करा • Save Language",
            onClick = { onLanguageSelected(selected) }
        )
    }
}

// -------------------------------------------------------------
// 5. HOME DASHBOARD (Dynamic greeting, stat cards & queue)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AshaDashboardScreen(
    userProfile: AshaUserProfile,
    onNavigateToRecord: () -> Unit,
    onNavigateToBeneficiaries: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToBeneficiaryProfile: (String) -> Unit = { _ -> onNavigateToRecord() }
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
                            modifier = Modifier.size(42.dp),
                            shape = CircleShape,
                            color = Color.White,
                            shadowElevation = 2.dp
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.app_logo),
                                contentDescription = "Logo",
                                modifier = Modifier.padding(4.dp)
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Online Sync Status Bar
            SyncStatusIndicator(
                isOnline = true,
                pendingSyncCount = 0,
                modifier = Modifier.fillMaxWidth()
            )

            // 3 Stat Cards Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                DashboardStatCard(
                    title = "आजच्या भेटी",
                    count = "८",
                    icon = Icons.Default.Assignment,
                    accentColor = PrimaryTeal,
                    modifier = Modifier.weight(1f)
                )
                DashboardStatCard(
                    title = "पूर्ण",
                    count = "५",
                    icon = Icons.Default.CheckCircle,
                    accentColor = SecondaryGreen,
                    modifier = Modifier.weight(1f)
                )
                DashboardStatCard(
                    title = "प्रलंबित",
                    count = "३",
                    icon = Icons.Default.Schedule,
                    accentColor = WarningAmber,
                    modifier = Modifier.weight(1f)
                )
            }

            // Signature Primary Call-to-Action: Record New Visit
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToRecord() },
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryTeal),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
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
                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
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

            // Beneficiary Queue Header & Items
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
                    Text(text = "सर्व पहा • View All", color = PrimaryTeal, fontWeight = FontWeight.Bold)
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
                        status = "ANC - २८ आठवडे",
                        isHighRisk = true,
                        rchId = "MH-PUN-0912",
                        onClick = { onNavigateToBeneficiaryProfile("BEN-1") }
                    )
                }
                item {
                    BeneficiaryCard(
                        name = "पूजा राहुल पाटील",
                        age = 21,
                        village = "वडगाव बुद्रुक",
                        status = "ANC - १६ आठवडे",
                        isHighRisk = false,
                        rchId = "MH-PUN-1184",
                        onClick = { onNavigateToBeneficiaryProfile("BEN-2") }
                    )
                }
                item {
                    BeneficiaryCard(
                        name = "कविता रमेश गायकवाड",
                        age = 27,
                        village = "शिवापूर वस्ती",
                        status = "PNC - ६ दिवस",
                        isHighRisk = true,
                        rchId = "MH-PUN-0742",
                        onClick = { onNavigateToBeneficiaryProfile("BEN-3") }
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
    var selectedCategory by remember { mutableStateOf("all") } // all, anc, pnc, high_risk
    var showAddDialog by remember { mutableStateOf(false) }

    var newName by remember { mutableStateOf("") }
    var newAge by remember { mutableStateOf("") }
    var newVillage by remember { mutableStateOf("") }
    var newCategory by remember { mutableStateOf("ANC") }
    var newGestWeeks by remember { mutableStateOf("12") }
    var newIsHighRisk by remember { mutableStateOf(false) }

    val beneficiaries = remember {
        mutableStateListOf(
            Beneficiary("BEN-1", "Sunita Shinde", "सुनिता संजय शिंदे", 24, "खेड शिवापूर", "शिवापूर", "ANC", 28, true, "MH-PUN-0912", "+91 98810 99401", "१५ ऑगस्ट २०२६", listOf("उच्च रक्तदाब (High BP)", "रक्तक्षय (Hb < 10)")),
            Beneficiary("BEN-2", "Pooja Patil", "पूजा राहुल पाटील", 21, "वडगाव बुद्रुक", "धायरी", "ANC", 16, false, "MH-PUN-1184", "+91 94220 88219", "२० नोव्हेंबर २०२६", emptyList()),
            Beneficiary("BEN-3", "Kavita Gaikwad", "कविता रमेश गायकवाड", 27, "शिवापूर वस्ती", "शिवापूर", "PNC", null, true, "MH-PUN-0742", "+91 98500 12345", null, listOf("कमी वजन (Underweight)")),
            Beneficiary("BEN-4", "Anita Jadhav", "अनिता विठ्ठल जाधव", 23, "खेड शिवापूर", "शिवापूर", "ANC", 32, false, "MH-PUN-0991", "+91 97654 32100", "०५ जुलै २०२६", emptyList())
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
                            contactPhone = dto.contactPhone,
                            edd = dto.edd,
                            highRiskReasons = dto.highRiskReasons ?: emptyList()
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
            // Search Input Field
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("नाव, गाव किंवा RCH ID शोधा...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SecondaryText) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", tint = SecondaryText)
                        }
                    }
                },
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryTeal,
                    unfocusedBorderColor = BorderColor
                )
            )

            // Category Filter Chips Row
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    FilterChip(
                        selected = selectedCategory == "all",
                        onClick = { selectedCategory = "all" },
                        label = { Text("सर्व (All)") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryTealContainer,
                            selectedLabelColor = PrimaryTealDark
                        )
                    )
                }
                item {
                    FilterChip(
                        selected = selectedCategory == "ANC",
                        onClick = { selectedCategory = "ANC" },
                        label = { Text("ANC (गर्भवती माता)") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryTealContainer,
                            selectedLabelColor = PrimaryTealDark
                        )
                    )
                }
                item {
                    FilterChip(
                        selected = selectedCategory == "PNC",
                        onClick = { selectedCategory = "PNC" },
                        label = { Text("PNC (प्रसूतीनंतर)") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryTealContainer,
                            selectedLabelColor = PrimaryTealDark
                        )
                    )
                }
                item {
                    FilterChip(
                        selected = selectedCategory == "high_risk",
                        onClick = { selectedCategory = "high_risk" },
                        label = { Text("उच्च जोखीम (High Risk)") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = DangerContainer,
                            selectedLabelColor = DangerRed
                        )
                    )
                }
            }

            // Filtered Beneficiaries List
            val filtered = beneficiaries.filter { b ->
                val matchesQuery = searchQuery.isBlank() ||
                        b.nameMr.contains(searchQuery, ignoreCase = true) ||
                        b.name.contains(searchQuery, ignoreCase = true) ||
                        b.village.contains(searchQuery, ignoreCase = true) ||
                        b.rchId.contains(searchQuery, ignoreCase = true)

                val matchesCategory = when (selectedCategory) {
                    "ANC" -> b.category.equals("ANC", ignoreCase = true)
                    "PNC" -> b.category.equals("PNC", ignoreCase = true)
                    "high_risk" -> b.isHighRisk
                    else -> true
                }

                matchesQuery && matchesCategory
            }

            if (filtered.isEmpty()) {
                EmptyState(
                    title = "कोणतेही लाभार्थी आढळले नाहीत",
                    subtitle = "शोध शब्द तपासा किंवा वर दिलेल्या बटणावरून नवीन लाभार्थी जोडा.",
                    icon = Icons.Default.Search,
                    actionText = if (searchQuery.isNotEmpty()) "शोध रीसेट करा" else null,
                    onAction = { searchQuery = "" }
                )
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(filtered) { b ->
                        BeneficiaryCard(
                            name = b.nameMr,
                            age = b.age,
                            village = b.village,
                            status = if (b.category.equals("PNC", ignoreCase = true)) "PNC माता" else "ANC - ${b.gestationalWeeks ?: 0} आठवडे",
                            isHighRisk = b.isHighRisk,
                            rchId = b.rchId,
                            onClick = { onSelectBeneficiary(b.id) }
                        )
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("नवीन लाभार्थी जोडा (Add Beneficiary)", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.verticalScroll(rememberScrollState())
                ) {
                    OutlinedTextField(
                        value = newName,
                        onValueChange = { newName = it },
                        label = { Text("मातेचे नाव (Marathi / English)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = newAge,
                        onValueChange = { newAge = it },
                        label = { Text("वय (Age)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = newVillage,
                        onValueChange = { newVillage = it },
                        label = { Text("गाव / वस्ती (Village)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = newGestWeeks,
                            onValueChange = { newGestWeeks = it },
                            label = { Text("आठवडे (Weeks)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .weight(1f)
                                .clickable { newIsHighRisk = !newIsHighRisk }
                                .padding(vertical = 8.dp)
                        ) {
                            Checkbox(checked = newIsHighRisk, onCheckedChange = { newIsHighRisk = it })
                            Text("उच्च जोखीम", style = MaterialTheme.typography.bodySmall)
                        }
                    }
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
                                    category = newCategory,
                                    gestationalWeeks = newGestWeeks.toIntOrNull() ?: 12,
                                    isHighRisk = newIsHighRisk,
                                    rchId = "MH-NEW-${System.currentTimeMillis() % 10000}",
                                    contactPhone = "+91 99999 00000",
                                    edd = "२० नोव्हेंबर २०२६",
                                    highRiskReasons = if (newIsHighRisk) listOf("निरीक्षण आवश्यक") else emptyList()
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
// 6B. BENEFICIARY PROFILE SCREEN (Full Maternal Profile)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BeneficiaryProfileScreen(
    beneficiaryId: String,
    onNavigateToRecord: (String) -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }

    val defaultBeneficiary = Beneficiary(
        id = beneficiaryId.ifBlank { "BEN-1" },
        name = "Sunita Sanjay Shinde",
        nameMr = "सुनिता संजय शिंदे",
        age = 24,
        village = "खेड शिवापूर",
        subCenter = "खेड शिवापूर उपकेंद्र",
        category = "ANC",
        gestationalWeeks = 28,
        isHighRisk = true,
        rchId = "MH-PUN-0912",
        contactPhone = "+91 98810 99401",
        edd = "१५ ऑगस्ट २०२६",
        highRiskReasons = listOf("उच्च रक्तदाब (High BP)", "रक्तक्षय (Hb < 10 gm%)")
    )

    var beneficiary by remember { mutableStateOf(defaultBeneficiary) }

    LaunchedEffect(beneficiaryId) {
        val result = repository.fetchBeneficiaries()
        result.onSuccess { dtoList ->
            val found = dtoList.find { it.id == beneficiaryId }
            if (found != null) {
                beneficiary = Beneficiary(
                    id = found.id,
                    name = found.name,
                    nameMr = found.nameMr,
                    age = found.age,
                    village = found.village,
                    subCenter = found.subCenter,
                    category = found.category,
                    gestationalWeeks = found.gestationalWeeks,
                    isHighRisk = found.isHighRisk,
                    rchId = found.rchId,
                    contactPhone = found.contactPhone,
                    edd = found.edd,
                    highRiskReasons = found.highRiskReasons ?: emptyList()
                )
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(beneficiary.nameMr, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Text("RCH: ${beneficiary.rchId}", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(modifier = Modifier.padding(16.dp)) {
                    PrimaryButton(
                        text = "या मातेची भेट नोंदवा • Record Visit",
                        leadingIcon = Icons.Default.Mic,
                        onClick = { onNavigateToRecord(beneficiary.id) }
                    )
                }
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Hero Profile Header Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (beneficiary.isHighRisk) DangerRed.copy(alpha = 0.4f) else BorderColor
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(if (beneficiary.isHighRisk) DangerContainer else PrimaryTealContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = beneficiary.name.take(2).uppercase(),
                            fontWeight = FontWeight.Bold,
                            color = if (beneficiary.isHighRisk) DangerRed else PrimaryTealDark,
                            style = MaterialTheme.typography.titleLarge
                        )
                    }

                    Column(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = beneficiary.nameMr,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryText
                        )
                        Text(
                            text = beneficiary.name,
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            StatusChip(
                                status = beneficiary.category,
                                label = "${beneficiary.category} माता"
                            )
                            if (beneficiary.isHighRisk) {
                                RiskBadge(isHighRisk = true)
                            }
                        }
                    }
                }
            }

            // Maternal Demographics Details
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "वैयक्तिक माहिती (Personal Details)",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryTeal
                    )
                    HorizontalDivider(color = BorderColor)

                    DetailRow(label = "वय (Age)", value = "${beneficiary.age} वर्षे")
                    DetailRow(label = "मोबाईल (Phone)", value = beneficiary.contactPhone)
                    DetailRow(label = "गाव / वस्ती (Village)", value = beneficiary.village)
                    DetailRow(label = "उपकेंद्र (Sub-Center)", value = beneficiary.subCenter)
                    DetailRow(label = "RCH आयडी (RCH ID)", value = beneficiary.rchId)
                }
            }

            // Obstetric & Clinical Details Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "वैद्यकीय व प्रसूती माहिती (Clinical & Obstetric)",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryTeal
                    )
                    HorizontalDivider(color = BorderColor)

                    DetailRow(
                        label = "गर्भावस्थेचे आठवडे (Gestational Weeks)",
                        value = "${beneficiary.gestationalWeeks ?: 28} आठवडे"
                    )
                    DetailRow(
                        label = "संभाव्य प्रसूती तारीख (EDD)",
                        value = beneficiary.edd ?: "१५ ऑगस्ट २०२६"
                    )
                    DetailRow(
                        label = "प्रसूती क्रम (Parity)",
                        value = "पहिली गर्भधारणा (Gravida 1)"
                    )

                    if (beneficiary.isHighRisk) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "जोखीम घटक (High Risk Factors):",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = DangerRed
                        )
                        beneficiary.highRiskReasons.forEach { reason ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(DangerRed)
                                )
                                Text(
                                    text = reason,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = DangerRed,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }
                }
            }

            // Recent Visits Timeline Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "मागील भेटींचा इतिहास (Visit Timeline)",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryTeal
                    )
                    HorizontalDivider(color = BorderColor)

                    RecentVisitItem(
                        date = "१४ जून २०२६",
                        details = "बीपी: १३८/८८ mmHg • हिमोग्लोबिन: १०.२ g/dL • वजन: ५४.५ kg",
                        status = "ANM मंजूर (Approved)"
                    )

                    RecentVisitItem(
                        date = "२८ मे २०२६",
                        details = "बीपी: १३०/८४ mmHg • हिमोग्लोबिन: १०.५ g/dL • वजन: ५३.० kg",
                        status = "ANM मंजूर (Approved)"
                    )
                }
            }
        }
    }
}

@Composable
private fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
        Text(text = value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = PrimaryText)
    }
}

@Composable
private fun RecentVisitItem(date: String, details: String, status: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(MainBackground)
            .padding(10.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = date, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = PrimaryText)
            Text(text = status, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = SecondaryGreen)
        }
        Text(text = details, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
    }
}

// -------------------------------------------------------------
// 7. VOICE RECORDING SCREEN (Pulsing Mic, Waveform & Tips)
// -------------------------------------------------------------
@Composable
fun VoiceRecordingScreen(
    onFinishRecording: () -> Unit,
    onCancel: () -> Unit,
    beneficiaryName: String = "सुनिता संजय शिंदे",
    language: String = "mr-IN"
) {
    var isRecording by remember { mutableStateOf(true) }
    var seconds by remember { mutableIntStateOf(14) }

    LaunchedEffect(isRecording) {
        while (isRecording) {
            delay(1000)
            seconds++
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        PrimaryTealDark,
                        Color(0xFF094A52),
                        PrimaryText
                    )
                )
            )
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onCancel,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color.White.copy(alpha = 0.15f))
            ) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
            }

            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color.White.copy(alpha = 0.15f),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.25f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(if (isRecording) DangerRed else WarningAmber)
                    )
                    Text(
                        text = if (isRecording) "थेट रेकॉर्डिंग सुरू आहे" else "रेकॉर्डिंग थांबवले",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = SecondaryGreen.copy(alpha = 0.25f)
            ) {
                Text(
                    text = "Sarvam Saaras",
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // Center Content: Audio Recorder with pulsating mic and waveform
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White.copy(alpha = 0.12f),
                modifier = Modifier.padding(horizontal = 12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Person, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                    Text(
                        text = "माता: $beneficiaryName",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }

            // Audio Recorder Component
            AudioRecorder(
                isRecording = isRecording,
                seconds = seconds,
                onToggleRecord = { isRecording = !isRecording },
                language = language
            )

            // Spoken dialect guidance tip
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White.copy(alpha = 0.08f),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.15f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.9f),
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "नैसर्गिक आवाजात बोला. बीपी (रक्तदाब), वजन, हिमोग्लोबिन, डोकेदुखी, पायावरील सूज यासारखे शब्द AI अचूक ओळखेल.",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White.copy(alpha = 0.85f)
                    )
                }
            }
        }

        // Bottom CTA
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            PrimaryButton(
                text = "रेकॉर्डिंग पूर्ण करा • Finish & Review",
                onClick = onFinishRecording,
                trailingIcon = Icons.AutoMirrored.Filled.ArrowForward,
                containerColor = SecondaryGreen
            )

            SecondaryButton(
                text = if (isRecording) "रेकॉर्डिंग थांबवा (Pause)" else "पुन्हा सुरू करा (Resume)",
                onClick = { isRecording = !isRecording },
                contentColor = Color.White
            )
        }
    }
}

// -------------------------------------------------------------
// 8. TRANSCRIPTION REVIEW SCREEN (Editable Devanagari Text & Audio)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TranscriptionReviewScreen(
    onExtractAI: () -> Unit,
    onReRecord: () -> Unit,
    initialTranscript: String = "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. सुनिताचे वय २४ वर्षे असून ती सध्या २८ आठवड्यांची गरोदर आहे. तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे. वजन ५४ किलो आहे. हिमोग्लोबिन १०.२ ग्रॅम भरले. तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे. बाळाची हालचाल व्यवस्थित आहे. मी तिला तातडीने प्राथमिक आरोग्य केंद्रात जाण्यास सांगितले."
) {
    var transcriptText by remember { mutableStateOf(initialTranscript) }
    var isPlayingAudio by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "आवाजाचे रूपांतर (Verbatim Transcript)",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryText
                        )
                        Text(
                            text = "Sarvam Saaras v3 ASR • मराठी",
                            style = MaterialTheme.typography.labelSmall,
                            color = PrimaryTeal
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onReRecord) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    SecondaryButton(
                        text = "पुन्हा रेकॉर्ड करा",
                        onClick = onReRecord,
                        modifier = Modifier.weight(1f),
                        leadingIcon = Icons.Default.Refresh
                    )

                    PrimaryButton(
                        text = "AI माहिती काढा • Extract",
                        onClick = onExtractAI,
                        modifier = Modifier.weight(1.2f),
                        trailingIcon = Icons.AutoMirrored.Filled.ArrowForward
                    )
                }
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Audio Playback Bar
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    IconButton(
                        onClick = { isPlayingAudio = !isPlayingAudio },
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(PrimaryTealContainer)
                    ) {
                        Icon(
                            imageVector = if (isPlayingAudio) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = if (isPlayingAudio) "Pause" else "Play",
                            tint = PrimaryTeal
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isPlayingAudio) "ऑडिओ वाजत आहे... (00:14 / 00:18)" else "मूळ रेकॉर्ड केलेला आवाज ऐका (00:18)",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = PrimaryText
                        )
                        LinearProgressIndicator(
                            progress = { if (isPlayingAudio) 0.75f else 0f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 6.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = PrimaryTeal,
                            trackColor = BorderColor
                        )
                    }
                }
            }

            // Editable Transcript Card Component
            TranscriptCard(
                transcript = transcriptText,
                onTranscriptChange = { transcriptText = it }
            )

            // AI Extraction Info Banner
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = SecondaryGreenContainer,
                border = androidx.compose.foundation.BorderStroke(1.dp, SecondaryGreen.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = SecondaryGreenDark,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "सदर मजकुरामधून वैद्यकीय निकष, रक्तदाब, वजन आणि धोक्याचे इशारे थेट मूळ वाक्यांच्या पुराव्यासह काढले जातील.",
                        style = MaterialTheme.typography.bodySmall,
                        color = SecondaryGreenDark
                    )
                }
            }
        }
    }
}

// -------------------------------------------------------------
// 9. STRUCTURED AI FORM (Vitals & Clinical Symptoms)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StructuredRecordScreen(
    onReviewEvidence: () -> Unit,
    onBack: () -> Unit
) {
    var bpSystolic by remember { mutableStateOf("140") }
    var bpDiastolic by remember { mutableStateOf("95") }
    var weight by remember { mutableStateOf("54.0") }
    var hb by remember { mutableStateOf("10.2") }
    var gestationalWeeks by remember { mutableStateOf("28") }
    var headache by remember { mutableStateOf(true) }
    var pedalEdema by remember { mutableStateOf(true) }
    var fetalMovementNormal by remember { mutableStateOf(true) }
    var ifaGiven by remember { mutableStateOf(true) }
    var referralFacility by remember { mutableStateOf("खेड शिवापूर ग्रामीण रुग्णालय (RH)") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("तयार झालेली भेट नोंद", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Text("सुनिता शिंदे • २८ आठवडे ANC", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(modifier = Modifier.padding(16.dp)) {
                    PrimaryButton(
                        text = "पुरावा पडताळा • Review Evidence",
                        onClick = onReviewEvidence,
                        trailingIcon = Icons.AutoMirrored.Filled.ArrowForward
                    )
                }
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // High Risk Alert Banner
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = DangerContainer,
                border = androidx.compose.foundation.BorderStroke(1.dp, DangerRed.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(Icons.Default.Warning, contentDescription = null, tint = DangerRed)
                    Column {
                        Text(
                            text = "उच्च जोखीम आढळली (High Risk Detected)",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = DangerRed
                        )
                        Text(
                            text = "रक्तदाब १४०/९५ mmHg आणि डोकेदुखी. वैद्यकीय पडताळणी आवश्यक.",
                            style = MaterialTheme.typography.bodySmall,
                            color = DangerRed
                        )
                    }
                }
            }

            // Section A: Vitals (मोजमापे)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("A. मोजमापे (Vital Signs)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall, color = PrimaryTeal)
                        StatusChip(status = "high_risk", label = "उच्च रक्तदाब")
                    }
                    HorizontalDivider(color = BorderColor)

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = bpSystolic,
                            onValueChange = { bpSystolic = it },
                            label = { Text("BP Systolic (mmHg)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = DangerRed,
                                unfocusedBorderColor = DangerRed.copy(alpha = 0.5f)
                            )
                        )
                        OutlinedTextField(
                            value = bpDiastolic,
                            onValueChange = { bpDiastolic = it },
                            label = { Text("BP Diastolic (mmHg)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = DangerRed,
                                unfocusedBorderColor = DangerRed.copy(alpha = 0.5f)
                            )
                        )
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = weight,
                            onValueChange = { weight = it },
                            label = { Text("वजन (Weight kg)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        OutlinedTextField(
                            value = hb,
                            onValueChange = { hb = it },
                            label = { Text("Hb (g/dL)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = WarningAmber,
                                unfocusedBorderColor = WarningAmber.copy(alpha = 0.5f)
                            )
                        )
                    }

                    OutlinedTextField(
                        value = gestationalWeeks,
                        onValueChange = { gestationalWeeks = it },
                        label = { Text("गर्भावस्थेचे आठवडे (Weeks)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }

            // Section B: Symptoms & Clinical Signs (लक्षणे)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("B. लक्षणे व निरीक्षणे (Symptoms)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall, color = PrimaryTeal)
                    HorizontalDivider(color = BorderColor)

                    SymptomToggleRow(
                        label = "तीव्र डोकेदुखी (Severe Headache)",
                        isChecked = headache,
                        onCheckedChange = { headache = it },
                        isDanger = true
                    )
                    SymptomToggleRow(
                        label = "पायावर सूज (Pedal Edema)",
                        isChecked = pedalEdema,
                        onCheckedChange = { pedalEdema = it },
                        isDanger = true
                    )
                    SymptomToggleRow(
                        label = "गर्भाची हालचाल नॉर्मल (Fetal Movements Normal)",
                        isChecked = fetalMovementNormal,
                        onCheckedChange = { fetalMovementNormal = it },
                        isDanger = false
                    )
                    SymptomToggleRow(
                        label = "IFA गोळ्यांचे वाटप (Iron-Folic Acid Tablets)",
                        isChecked = ifaGiven,
                        onCheckedChange = { ifaGiven = it },
                        isDanger = false
                    )
                }
            }

            // Section C: Referral Facility
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("C. संदर्भ सेवा (Referral Hospital)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall, color = PrimaryTeal)
                    HorizontalDivider(color = BorderColor)

                    OutlinedTextField(
                        value = referralFacility,
                        onValueChange = { referralFacility = it },
                        label = { Text("शिफारस केलेले रुग्णालय (Facility)") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun SymptomToggleRow(
    label: String,
    isChecked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    isDanger: Boolean
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .clickable { onCheckedChange(!isChecked) }
            .padding(vertical = 6.dp, horizontal = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = label, style = MaterialTheme.typography.bodyMedium, color = PrimaryText)
            if (isDanger && isChecked) {
                Text(text = "धोक्याची घंटा (Danger Sign)", style = MaterialTheme.typography.labelSmall, color = DangerRed, fontWeight = FontWeight.Bold)
            }
        }
        Switch(
            checked = isChecked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = if (isDanger) DangerRed else SecondaryGreen
            )
        )
    }
}

// -------------------------------------------------------------
// 10. EVIDENCE REVIEW SCREEN (Zero-Hallucination Traceability)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EvidenceReviewScreen(
    onConfirm: () -> Unit,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("पुरावा पडताळणी (Evidence Tracing)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Text("Zero-Hallucination Human Verification", style = MaterialTheme.typography.labelSmall, color = SecondaryGreen)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(modifier = Modifier.padding(16.dp)) {
                    PrimaryButton(
                        text = "वैद्यकीय नियम तपासा • Validate Rules",
                        onClick = onConfirm,
                        trailingIcon = Icons.AutoMirrored.Filled.ArrowForward
                    )
                }
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Trust & Traceability Header Banner
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = SecondaryGreenContainer,
                border = androidx.compose.foundation.BorderStroke(1.dp, SecondaryGreen.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(Icons.Default.Verified, contentDescription = null, tint = SecondaryGreenDark, modifier = Modifier.size(22.dp))
                    Column {
                        Text(
                            text = "प्रत्येक निष्कर्षाचा मूळ पुरावा (Source Linked)",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = SecondaryGreenDark
                        )
                        Text(
                            text = "AI ने काढलेला प्रत्येक आकडा आवाजातील शब्दाशी थेट जोडलेला आहे.",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryGreenDark
                        )
                    }
                }
            }

            // Evidence Cards
            EvidenceFieldCard(
                label = "रक्तदाब (Blood Pressure)",
                value = "140/95",
                unit = "mmHg",
                supportingPhrase = "तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे.",
                isConcerning = true,
                confidence = 0.98f
            )

            EvidenceFieldCard(
                label = "वजन (Body Weight)",
                value = "54.0",
                unit = "kg",
                supportingPhrase = "वजन ५४ किलो आहे.",
                isConcerning = false,
                confidence = 0.99f
            )

            EvidenceFieldCard(
                label = "हिमोग्लोबिन (Hemoglobin)",
                value = "10.2",
                unit = "g/dL",
                supportingPhrase = "हिमोग्लोबिन १०.२ ग्रॅम भरले.",
                isConcerning = true,
                confidence = 0.96f
            )

            EvidenceFieldCard(
                label = "लक्षण: तीव्र डोकेदुखी (Headache)",
                value = "Reported (आहे)",
                supportingPhrase = "तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे",
                isConcerning = true,
                confidence = 0.95f
            )

            EvidenceFieldCard(
                label = "लक्षण: पायावर सूज (Pedal Edema)",
                value = "Mild Edema (हलकी सूज)",
                supportingPhrase = "आणि पायावर हलकी सूज आहे.",
                isConcerning = true,
                confidence = 0.93f
            )
        }
    }
}

// -------------------------------------------------------------
// 11. VALIDATION SCREEN (High-Risk Rules & Warning Triage)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
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

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("वैद्यकीय नियम पडताळणी", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                        Text("Clinical Decision Support Protocols", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MainBackground)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Confirmation Checkbox
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .clickable { isConfirmed = !isConfirmed }
                            .padding(vertical = 4.dp)
                    ) {
                        Checkbox(
                            checked = isConfirmed,
                            onCheckedChange = { isConfirmed = it },
                            colors = CheckboxDefaults.colors(checkedColor = PrimaryTeal)
                        )
                        Text(
                            text = "मी सर्व माहिती तपासली असून ती खरी व योग्य असल्याची खात्री करत आहे. (Human Verification)",
                            style = MaterialTheme.typography.bodySmall,
                            color = PrimaryText,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    PrimaryButton(
                        text = "अंतिम खात्री व सबमिट करा • Submit Record",
                        onClick = {
                            isSubmitting = true
                            val draftId = "REC-PUN-${System.currentTimeMillis() % 100000}"

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

                            coroutineScope.launch {
                                val createReq = CreateVisitRequest(
                                    beneficiaryId = "BEN-MH-PUN-0841",
                                    ashaId = repository.getTokenManager().getUserId() ?: "USR-ASHA-001",
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
                        isLoading = isSubmitting,
                        enabled = isConfirmed && !isSubmitting,
                        containerColor = SecondaryGreen
                    )
                }
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Critical Risk 1: Gestational Hypertension
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = DangerContainer),
                border = androidx.compose.foundation.BorderStroke(1.dp, DangerRed.copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = DangerRed)
                        Text(
                            text = "गंभीर इशारा: उच्च रक्तदाब (Gestational Hypertension)",
                            fontWeight = FontWeight.Bold,
                            color = DangerRed,
                            style = MaterialTheme.typography.titleSmall
                        )
                    }
                    Text(
                        text = "रक्तदाब १४०/९५ mmHg सामान्य मर्यादेपेक्षा जास्त आहे. मातेला डोकेदुखी व पायावर सूज असल्याने प्री-एक्लॅम्प्सियाचा धोका असू शकतो. त्वरित प्राथमिक आरोग्य केंद्रात (PHC) डॉक्टरांकडे पाठवा.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = PrimaryText
                    )
                }
            }

            // Warning 2: Mild Anemia
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = WarningContainer),
                border = androidx.compose.foundation.BorderStroke(1.dp, WarningAmber.copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = WarningAmber)
                        Text(
                            text = "मध्यम इशारा: रक्तक्षय (Mild Anemia)",
                            fontWeight = FontWeight.Bold,
                            color = WarningAmber,
                            style = MaterialTheme.typography.titleSmall
                        )
                    }
                    Text(
                        text = "हिमोग्लोबिन १०.२ g/dL (अपेक्षित: >= ११.० g/dL). आयर्न-फॉलिक ॲसिड (IFA) गोळ्यांचा नियमित डोस सुरू ठेवा व आहाराबाबत मार्गदर्शन करा.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = PrimaryText
                    )
                }
            }

            // Safe Sign 3: Fetal movements
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SecondaryGreenContainer),
                border = androidx.compose.foundation.BorderStroke(1.dp, SecondaryGreen.copy(alpha = 0.4f))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SecondaryGreenDark)
                    Text(
                        text = "बाळाची हालचाल नॉर्मल आहे • Fetal Movements Normal",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = SecondaryGreenDark
                    )
                }
            }
        }
    }
}

// -------------------------------------------------------------
// 12. CONFIRMATION SCREEN (Success feedback & Next Actions)
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
        Spacer(modifier = Modifier.height(24.dp))

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Surface(
                modifier = Modifier.size(96.dp),
                shape = CircleShape,
                color = SecondaryGreenContainer,
                border = androidx.compose.foundation.BorderStroke(2.dp, SecondaryGreen.copy(alpha = 0.4f))
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        Icons.Default.Check,
                        contentDescription = "Success",
                        tint = SecondaryGreen,
                        modifier = Modifier.size(52.dp)
                    )
                }
            }

            Text(
                text = "भेट नोंद यशस्वीरीत्या जतन झाली!",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = PrimaryText,
                textAlign = TextAlign.Center
            )

            Text(
                text = "माहिती स्थानिक डेटाबेसमध्ये सुरक्षित झाली असून ANM कडे पाठवली गेली आहे.",
                style = MaterialTheme.typography.bodyMedium,
                color = SecondaryText,
                textAlign = TextAlign.Center
            )

            // Confirmation Summary Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("नोंद क्रमांक (Record ID)", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                        Text("REC-2026-PUN-0914", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = PrimaryTeal)
                    }
                    HorizontalDivider(color = BorderColor)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("माता (Beneficiary)", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                        Text("सुनिता संजय शिंदे", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = PrimaryText)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("सिंक स्थिती (Sync Status)", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                        StatusChip(status = "pending_anm_review", label = "ANM पुनरावलोकन प्रलंबित")
                    }
                }
            }
        }

        // Action Buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            PrimaryButton(
                text = "मुख्य पृष्ठावर जा • Go to Dashboard",
                onClick = onGoHome,
                containerColor = PrimaryTeal
            )

            SecondaryButton(
                text = "इतिहास पहा • View History",
                onClick = onViewHistory
            )
        }
    }
}

// -------------------------------------------------------------
// 13. VISIT HISTORY SCREEN (SQLite Drafts + Server Records)
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VisitHistoryScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    val localDrafts = remember { mutableStateListOf<DraftVisit>() }
    var selectedFilter by remember { mutableStateOf("all") } // all, offline, reviewed

    LaunchedEffect(Unit) {
        localDrafts.clear()
        localDrafts.addAll(repository.getLocalDrafts())
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("मागील भेट नोंदी (Visit History)", fontWeight = FontWeight.Bold) },
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
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Filter Chips Row
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    FilterChip(
                        selected = selectedFilter == "all",
                        onClick = { selectedFilter = "all" },
                        label = { Text("सर्व नोंदी (All)") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryTealContainer,
                            selectedLabelColor = PrimaryTealDark
                        )
                    )
                }
                item {
                    FilterChip(
                        selected = selectedFilter == "offline",
                        onClick = { selectedFilter = "offline" },
                        label = { Text("स्थानिक ड्राफ्ट (${localDrafts.size})") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = WarningContainer,
                            selectedLabelColor = WarningAmber
                        )
                    )
                }
                item {
                    FilterChip(
                        selected = selectedFilter == "reviewed",
                        onClick = { selectedFilter = "reviewed" },
                        label = { Text("मंजूर (Approved)") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = SecondaryGreenContainer,
                            selectedLabelColor = SecondaryGreenDark
                        )
                    )
                }
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Live SQLite Drafts from Frontline Device
                if (selectedFilter != "reviewed") {
                    items(localDrafts) { draft ->
                        VisitCard(
                            recordId = draft.id,
                            beneficiaryName = draft.beneficiaryName,
                            date = "स्थानिक नोंद • ${if (draft.syncStatus == "SYNCED") "सर्व्हरवर सिंक पूर्ण" else "सिंक प्रलंबित"}",
                            bp = "${draft.bpSystolic}/${draft.bpDiastolic}",
                            weight = "${draft.weightKg ?: "--"} kg",
                            hb = "${draft.hemoglobinGDl ?: "--"} g/dL",
                            status = if (draft.syncStatus == "SYNCED") "approved" else "pending",
                            onClick = { }
                        )
                    }
                }

                if (selectedFilter != "offline") {
                    item {
                        VisitCard(
                            recordId = "REC-PUN-0841",
                            beneficiaryName = "सुनिता संजय शिंदे",
                            date = "३१ ऑक्टोबर २०२६ • ०९:४० AM",
                            bp = "१४०/९५",
                            weight = "५४.० kg",
                            hb = "१०.२ g/dL",
                            status = "pending",
                            onClick = { }
                        )
                    }
                    item {
                        VisitCard(
                            recordId = "REC-PUN-0720",
                            beneficiaryName = "पूजा राहुल पाटील",
                            date = "३० ऑक्टोबर २०२६ • ०२:१५ PM",
                            bp = "११८/७६",
                            weight = "४९.० kg",
                            hb = "११.५ g/dL",
                            status = "approved",
                            onClick = { }
                        )
                    }
                    item {
                        VisitCard(
                            recordId = "REC-PUN-0691",
                            beneficiaryName = "कविता रमेश गायकवाड",
                            date = "२८ ऑक्टोबर २०२६ • ११:०० AM",
                            bp = "१३०/८५",
                            weight = "५२.० kg",
                            hb = "९.८ g/dL",
                            status = "approved",
                            onClick = { }
                        )
                    }
                }
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
    val context = LocalContext.current
    val repository = remember { AppRepository(context) }
    val tokenManager = repository.getTokenManager()
    val isProd = tokenManager.isProductionMode()

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
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(modifier = Modifier.padding(16.dp)) {
                    PrimaryButton(
                        text = "लॉग आऊट / वापरकर्ता बदला • Logout",
                        onClick = {
                            tokenManager.clearSession()
                            onLogout()
                        },
                        containerColor = DangerRed,
                        leadingIcon = Icons.Default.Close
                    )
                }
            }
        },
        containerColor = MainBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Worker Profile Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(PrimaryTealContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = PrimaryTeal, modifier = Modifier.size(32.dp))
                    }
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(userProfile.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium, color = PrimaryText)
                        Text(userProfile.phone, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                        Text(userProfile.subCenter, style = MaterialTheme.typography.labelSmall, color = PrimaryTeal, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            // Options List
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("भाषा बदला (Change Language)") },
                        supportingContent = { Text("मराठी / हिन्दी (Dialect Selection)") },
                        leadingContent = { Icon(Icons.Default.Translate, contentDescription = null, tint = PrimaryTeal) },
                        trailingContent = { Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = SecondaryText) },
                        modifier = Modifier.clickable { onNavigateLanguage() }
                    )
                    HorizontalDivider(color = BorderColor)
                    ListItem(
                        headlineContent = { Text("आवाज ओळख इंजिन (ASR Engine)") },
                        supportingContent = { Text("Sarvam Saaras v3 Indic AI") },
                        leadingContent = { Icon(Icons.Default.Mic, contentDescription = null, tint = SecondaryGreen) }
                    )
                    HorizontalDivider(color = BorderColor)
                    ListItem(
                        headlineContent = { Text("ऑफलाइन डेटाबेस (Local Storage)") },
                        supportingContent = { Text("SQLite Room Cache • Synced") },
                        leadingContent = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SecondaryGreen) }
                    )
                    HorizontalDivider(color = BorderColor)
                    ListItem(
                        headlineContent = { Text("पर्यावरण मोड (Environment Mode)") },
                        supportingContent = {
                            Text(if (isProd) "उत्पादन मोड (Production Mode)" else "विकास मोड (Development Mode)")
                        },
                        leadingContent = { Icon(Icons.Default.Shield, contentDescription = null, tint = if (isProd) SecondaryGreen else WarningAmber) }
                    )
                }
            }
        }
    }
}
