package com.visitrecord.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.visitrecord.app.ui.theme.BorderColor
import com.visitrecord.app.ui.theme.MainBackground

@Composable
fun LoadingSkeleton(
    modifier: Modifier = Modifier,
    height: Int = 80
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(MainBackground)
    )
}
