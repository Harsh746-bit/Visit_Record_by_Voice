package com.visitrecord.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.visitrecord.app.ui.theme.*

@Composable
fun BeneficiaryCard(
    name: String,
    age: Int,
    village: String,
    status: String,
    isHighRisk: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    nameMr: String? = null,
    rchId: String? = null
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isHighRisk) DangerRed.copy(alpha = 0.4f) else BorderColor
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                // Avatar Badge
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isHighRisk) DangerContainer else PrimaryTealContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = name.take(2).uppercase(),
                        fontWeight = FontWeight.Bold,
                        color = if (isHighRisk) DangerRed else PrimaryTealDark,
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(
                        text = name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryText
                    )

                    if (nameMr != null && nameMr != name) {
                        Text(
                            text = nameMr,
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            tint = SecondaryText,
                            modifier = Modifier.size(13.dp)
                        )
                        Text(
                            text = "$village • वय $age वर्ष",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))
                    RiskBadge(isHighRisk = isHighRisk)
                }
            }

            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                contentDescription = null,
                tint = SecondaryText,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
