package app.kinday.ui.parent

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.UploadFile
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class ExtractedEventUi(
    val id: String,
    val title: String,
    val date: String,
    val time: String,
    val category: String,
    val isConfirmed: Boolean = false
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ParentHubScreen(
    isTablet: Boolean,
    onSwitchToKidsZone: () -> Unit
) {
    val sampleEvents = listOf(
        ExtractedEventUi("1", "Science Exhibition Project", "Dec 12, 2026", "09:00 AM", "School"),
        ExtractedEventUi("2", "Annual Sports Practice", "Dec 15, 2026", "All Day", "Activity"),
        ExtractedEventUi("3", "Term 2 Activity Fee Deadline", "Dec 20, 2026", "05:00 PM", "Fee")
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("kinDay Parent Hub", fontWeight = FontWeight.Bold)
                },
                actions = {
                    Button(
                        onClick = onSwitchToKidsZone,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFDE68A)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Switch to Kids Zone", color = Color(0xFF78350F), fontWeight = FontWeight.Bold)
                    }
                }
            )
        }
    ) { innerPadding ->
        if (isTablet) {
            // Tablet Hero Layout: Side-by-Side Split View
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left 50%: Document Viewer & Upload Zone
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(20.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.UploadFile,
                            contentDescription = "Upload",
                            tint = Color(0xFFEA580C),
                            modifier = Modifier.size(64.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Drop School Circular or Take Photo",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Text(
                            text = "AI extracts dates into drafts with zero child data exposure",
                            fontSize = 12.sp,
                            color = Color(0xFF78716C)
                        )
                    }
                }

                // Right 50%: Extracted Draft Events
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    EventListContent(events = sampleEvents)
                }
            }
        } else {
            // Phone Layout: Vertical Stack
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(16.dp)
            ) {
                EventListContent(events = sampleEvents)
            }
        }
    }
}

@Composable
fun EventListContent(events: List<ExtractedEventUi>) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "AI Extracted Draft Events",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Suggested by AI. Review and confirm before adding to calendar.",
            fontSize = 12.sp,
            color = Color(0xFF78716C),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(events) { event ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFAFAF9))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(event.title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text("${event.date} • ${event.time}", fontSize = 12.sp, color = Color(0xFF78716C))
                        }
                        Button(
                            onClick = { /* Confirm */ },
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEA580C))
                        ) {
                            Text("Confirm")
                        }
                    }
                }
            }
        }
    }
}
