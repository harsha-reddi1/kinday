package app.kinday.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "pending_completions")
data class RoutineCompletionEntity(
    @PrimaryKey val idempotencyKey: String, // UUID generated on device
    val routineId: String,
    val childId: String,
    val completionDate: String, // YYYY-MM-DD
    val completedAtTimestamp: Long,
    val isSynced: Boolean = false
)
