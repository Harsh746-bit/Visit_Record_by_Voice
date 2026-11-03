package com.visitrecord.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.visitrecord.app.ui.theme.*

@Composable
fun EvidenceFieldCard(
    label: String,
    value: String,
    supportingPhrase: String,
    modifier: Modifier = Modifier,
    unit: String? = null,
    isConcerning: Boolean = false,
    confidence: Float? = null,
    onEdit: (() -> Unit)? = null
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isConcerning) DangerContainer.copy(alpha = 0.3f) else CardBackground
        ),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isConcerning) DangerRed.copy(alpha = 0.4f) else BorderColor
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText,
                    fontWeight = FontWeight.SemiBold
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    if (confidence != null) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = PrimaryTealContainer
                        ) {
                            Text(
                                text = "${(confidence * 100).toInt()}% विश्वास",
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                style = MaterialTheme.typography.labelSmall,
                                color = PrimaryTealDark,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    if (isConcerning) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Concerning",
                            tint = DangerRed,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }

            // Extracted Value
            Row(
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = if (isConcerning) DangerRed else PrimaryText
                )
                if (unit != null) {
                    Text(
                        text = unit,
                        style = MaterialTheme.typography.bodySmall,
                        color = SecondaryText,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }
            }

            // Supporting Verbatim Text (Traceability)
            if (supportingPhrase.isNotBlank()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(MainBackground)
                        .border(1.dp, BorderColor, RoundedCornerShape(10.dp))
                        .padding(horizontal = 10.dp, vertical = 8.dp)
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Text(
                            text = "पुरावा:",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryTeal
                        )
                        Text(
                            text = "\"$supportingPhrase\"",
                            style = MaterialTheme.typography.bodySmall,
                            color = PrimaryText
                        )
                    }
                }
            }

            if (onEdit != null) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onEdit) {
                        Text(
                            text = "दुरुस्त करा • Edit",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryTeal
                        )
                    }
                }
            }
        }
    }
}
