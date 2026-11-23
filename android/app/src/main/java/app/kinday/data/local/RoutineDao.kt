package app.kinday.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface RoutineDao {

    @Query("SELECT * FROM cached_routines WHERE childId = :childId")
    fun getRoutinesForChild(childId: String): Flow<List<RoutineEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRoutines(routines: List<RoutineEntity>)

    @Query("SELECT * FROM pending_completions WHERE isSynced = 0")
    suspend fun getUnsyncedCompletions(): List<RoutineCompletionEntity>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun recordCompletion(completion: RoutineCompletionEntity)

    @Query("UPDATE pending_completions SET isSynced = 1 WHERE idempotencyKey = :key")
    suspend fun markSynced(key: String)
}
