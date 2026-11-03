package com.visitrecord.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.visitrecord.app.ui.theme.*

@Composable
fun TranscriptCard(
    transcript: String,
    onTranscriptChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isReadOnly: Boolean = false
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "आवाजाचे रूपांतर (Verbatim Transcript)",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryText
                )

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = PrimaryTealContainer
                ) {
                    Text(
                        text = "Sarvam Saaras v3",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = PrimaryTealDark,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Text(
                text = "उच्चार किंवा आवाजात काही त्रुटी असल्यास खालील मजकुरात बदल करू शकता:",
                style = MaterialTheme.typography.bodySmall,
                color = SecondaryText
            )

            OutlinedTextField(
                value = transcript,
                onValueChange = onTranscriptChange,
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 140.dp),
                shape = RoundedCornerShape(12.dp),
                readOnly = isReadOnly,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryTeal,
                    unfocusedBorderColor = BorderColor
                ),
                textStyle = MaterialTheme.typography.bodyMedium
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "शब्द संख्या: ${transcript.trim().split("\\s+".toRegex()).size}",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText
                )
                Text(
                    text = "मराठी व हिंदी देवनागरी समर्थन",
                    style = MaterialTheme.typography.labelSmall,
                    color = PrimaryTeal
                )
            }
        }
    }
}
