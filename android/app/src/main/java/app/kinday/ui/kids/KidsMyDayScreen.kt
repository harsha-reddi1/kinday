package app.kinday.ui.kids

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.Circle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class RoutineUiModel(
    val id: String,
    val title: String,
    val timeOfDay: String,
    val starReward: Int,
    val isCompleted: Boolean = false
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KidsMyDayScreen(
    isTablet: Boolean,
    onExitRequested: () -> Unit
) {
    var starBalance by remember { mutableIntStateOf(14) }
    var routines by remember {
        mutableStateOf(
            listOf(
                RoutineUiModel("1", "Brush Teeth", "Morning", 1),
                RoutineUiModel("2", "Put on School Uniform", "Morning", 1),
                RoutineUiModel("3", "Pack Backpack", "Morning", 2),
                RoutineUiModel("4", "20 Mins Reading", "Afternoon", 2),
                RoutineUiModel("5", "Tidy Up Toys", "Evening", 1),
                RoutineUiModel("6", "Bedtime on Time", "Night", 2)
            )
        )
    }

    val columns = if (isTablet) GridCells.Fixed(3) else GridCells.Fixed(1)

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Child Avatar & Name
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFFFDE68A)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "🦁", fontSize = 28.sp)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Leo's Day",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF1C1917)
                        )
                        Text(
                            text = "Today's Checklist",
                            fontSize = 13.sp,
                            color = Color(0xFF78716C)
                        )
                    }
                }

                // Star Counter & Exit Lock Button
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = "Stars",
                                tint = Color(0xFFF59E0B),
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "$starBalance",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF78350F)
                            )
                        }
                    }

                    IconButton(
                        onClick = onExitRequested,
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color(0xFFF5F5F4))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = "Parent Gate Lock",
                            tint = Color(0xFF57534E)
                        )
                    }
                }
            }
        },
        containerColor = Color(0xFFFFFBEB)
    ) { innerPadding ->
        LazyVerticalGrid(
            columns = columns,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 20.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(routines, key = { it.id }) { routine ->
                RoutineCard(
                    routine = routine,
                    onClick = {
                        val toggled = !routine.isCompleted
                        routines = routines.map {
                            if (it.id == routine.id) it.copy(isCompleted = toggled) else it
                        }
                        starBalance += if (toggled) routine.starReward else -routine.starReward
                    }
                )
            }
        }
    }
}

@Composable
fun RoutineCard(
    routine: RoutineUiModel,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 140.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (routine.isCompleted) Color(0xFFECFDF5) else Color.White
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = routine.timeOfDay.uppercase(),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFA8A29E)
                )

                Surface(
                    shape = CircleShape,
                    color = Color(0xFFFEF3C7)
                ) {
                    Text(
                        text = "+${routine.starReward} ★",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFFB45309),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = routine.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (routine.isCompleted) Color(0xFFA8A29E) else Color(0xFF1C1917)
                )

                Icon(
                    imageVector = if (routine.isCompleted) Icons.Default.CheckCircle else Icons.Outlined.Circle,
                    contentDescription = "Status",
                    tint = if (routine.isCompleted) Color(0xFF10B981) else Color(0xFFD6D3D1),
                    modifier = Modifier.size(36.dp)
                )
            }
        }
    }
}
