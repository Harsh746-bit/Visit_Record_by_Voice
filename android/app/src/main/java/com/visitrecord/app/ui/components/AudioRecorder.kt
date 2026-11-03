package com.visitrecord.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.visitrecord.app.ui.theme.*

@Composable
fun AudioRecorder(
    isRecording: Boolean,
    seconds: Int,
    onToggleRecord: () -> Unit,
    modifier: Modifier = Modifier,
    language: String = "mr-IN"
) {
    // Pulse animation when recording
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (isRecording) 1.15f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(CardBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Language Pill
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = PrimaryTealContainer
        ) {
            Text(
                text = if (language == "hi-IN") "भाषा: हिन्दी (Sarvam Saaras)" else "भाषा: मराठी (Sarvam Saaras)",
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                style = MaterialTheme.typography.labelSmall,
                color = PrimaryTealDark,
                fontWeight = FontWeight.Bold
            )
        }

        // Duration Display
        Text(
            text = "00:${seconds.toString().padStart(2, '0')}",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = if (isRecording) DangerRed else PrimaryText
        )

        // Waveform Bars
        Row(
            modifier = Modifier.height(48.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val waveHeights = listOf(16, 28, 42, 22, 38, 48, 32, 20, 44, 26, 36)
            waveHeights.forEachIndexed { index, baseHeight ->
                val barHeight = if (isRecording) {
                    ((baseHeight + (seconds * 7 + index * 5) % 25)).dp
                } else {
                    8.dp
                }

                Box(
                    modifier = Modifier
                        .width(4.dp)
                        .height(barHeight)
                        .clip(RoundedCornerShape(2.dp))
                        .background(if (isRecording) SecondaryGreen else BorderColor)
                )
            }
        }

        // Large Center Mic / Stop Button with Pulse halo
        Box(
            modifier = Modifier
                .size(110.dp)
                .scale(pulseScale)
                .clip(CircleShape)
                .background(if (isRecording) DangerRed.copy(alpha = 0.2f) else PrimaryTeal.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(if (isRecording) DangerRed else PrimaryTeal)
                    .clickable { onToggleRecord() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isRecording) Icons.Default.Stop else Icons.Default.Mic,
                    contentDescription = if (isRecording) "Stop" else "Record",
                    tint = Color.White,
                    modifier = Modifier.size(36.dp)
                )
            }
        }

        Text(
            text = if (isRecording) "रेकॉर्डिंग सुरू आहे... पूर्ण झाल्यावर लाल बटण दाबा" else "रेकॉर्डिंग सुरू करण्यासाठी वरील बटण दाबा",
            style = MaterialTheme.typography.bodySmall,
            color = SecondaryText,
            textAlign = TextAlign.Center
        )
    }
}
