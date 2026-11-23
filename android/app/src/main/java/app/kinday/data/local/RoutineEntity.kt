package app.kinday.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_routines")
data class RoutineEntity(
    @PrimaryKey val id: String,
    val childId: String,
    val title: String,
    val iconPreset: String,
    val timeOfDay: String, // 'morning', 'afternoon', 'evening', 'anytime'
    val starValue: Int,
    val needsApproval: Boolean,
    val daysOfWeek: String // comma-separated e.g. "1,2,3,4,5,6,7"
)
