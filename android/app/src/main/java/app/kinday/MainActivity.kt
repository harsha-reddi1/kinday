package app.kinday

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.windowsizeclass.ExperimentalMaterial3WindowSizeClassApi
import androidx.compose.material3.windowsizeclass.WindowWidthSizeClass
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import app.kinday.ui.kids.KidsMyDayScreen
import app.kinday.ui.parent.ParentHubScreen

enum class AppMode {
    PARENT_HUB,
    KIDS_ZONE
}

class MainActivity : ComponentActivity() {
    @OptIn(ExperimentalMaterial3WindowSizeClassApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val windowSizeClass = calculateWindowSizeClass(this)
            val isTablet = windowSizeClass.widthSizeClass != WindowWidthSizeClass.Compact

            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    KinDayAppRoot(isTablet = isTablet)
                }
            }
        }
    }
}

@Composable
fun KinDayAppRoot(isTablet: Boolean) {
    var currentMode by remember { mutableStateOf(AppMode.KIDS_ZONE) }

    when (currentMode) {
        AppMode.KIDS_ZONE -> {
            KidsMyDayScreen(
                isTablet = isTablet,
                onExitRequested = {
                    // Triggers 4-digit Parent PIN Dialog before switching
                    currentMode = AppMode.PARENT_HUB
                }
            )
        }
        AppMode.PARENT_HUB -> {
            ParentHubScreen(
                isTablet = isTablet,
                onSwitchToKidsZone = {
                    currentMode = AppMode.KIDS_ZONE
                }
            )
        }
    }
}
