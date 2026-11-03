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
fun SyncStatusIndicator(
    isOnline: Boolean,
    pendingSyncCount: Int = 0,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(if (isOnline) SecondaryGreenContainer else WarningContainer)
            .border(
                1.dp,
                if (isOnline) SecondaryGreen.copy(alpha = 0.4f) else WarningAmber.copy(alpha = 0.4f),
                RoundedCornerShape(12.dp)
            )
            .padding(horizontal = 10.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Box(
            modifier = Modifier
                .size(7.dp)
                .clip(CircleShape)
                .background(if (isOnline) SecondaryGreen else WarningAmber)
        )
        Text(
            text = if (isOnline) {
                if (pendingSyncCount > 0) "ऑनलाइन • $pendingSyncCount सिंक बाकी" else "ऑनलाइन जोडलेले • Synced"
            } else {
                "ऑफलाइन मोड • $pendingSyncCount स्थानिक नोंदी"
            },
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = if (isOnline) SecondaryGreenDark else WarningAmber
        )
    }
}
