package com.visitrecord.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.visitrecord.app.ui.theme.*

@Composable
fun StatusChip(
    status: String,
    modifier: Modifier = Modifier,
    label: String? = null
) {
    val normalized = status.lowercase().replace('-', '_')

    val (bg, textColor, borderColor, dotColor, defaultText) = when (normalized) {
        "pending", "pending_anm_review" -> listOf(
            WarningContainer,
            WarningAmber,
            WarningAmber.copy(alpha = 0.4f),
            WarningAmber,
            "प्रलंबित • Pending"
        )
        "reviewed", "approved", "approved_synced" -> listOf(
            SecondaryGreenContainer,
            SecondaryGreenDark,
            SecondaryGreen.copy(alpha = 0.4f),
            SecondaryGreen,
            "मंजूर • Approved"
        )
        "returned" -> listOf(
            DangerContainer,
            DangerRed,
            DangerRed.copy(alpha = 0.4f),
            DangerRed,
            "पुन्हा तपासणी • Returned"
        )
        "high_risk", "critical" -> listOf(
            DangerContainer,
            DangerRed,
            DangerRed,
            DangerRed,
            "उच्च जोखीम • High Risk"
        )
        else -> listOf(
            PrimaryTealContainer,
            PrimaryTealDark,
            PrimaryTeal.copy(alpha = 0.3f),
            PrimaryTeal,
            status
        )
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(bg as Color)
            .border(1.dp, borderColor as Color, RoundedCornerShape(10.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp)
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(dotColor as Color)
        )
        Text(
            text = label ?: (defaultText as String),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = textColor as Color
        )
    }
}

@Composable
fun RiskBadge(
    isHighRisk: Boolean,
    modifier: Modifier = Modifier
) {
    if (isHighRisk) {
        StatusChip(status = "high_risk", modifier = modifier)
    } else {
        Row(
            modifier = modifier
                .clip(RoundedCornerShape(10.dp))
                .background(Color.White)
                .border(1.dp, BorderColor, RoundedCornerShape(10.dp))
                .padding(horizontal = 8.dp, vertical = 3.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(SecondaryGreen)
            )
            Text(
                text = "सामान्य • Routine",
                style = MaterialTheme.typography.labelSmall,
                color = SecondaryText,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
