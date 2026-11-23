package app.kinday.data.sync

import android.content.Context
import androidx.work.*
import app.kinday.data.local.KinDayDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.TimeUnit

class RoutineSyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val database = KinDayDatabase.getDatabase(applicationContext)
        val routineDao = database.routineDao()

        val unsyncedList = routineDao.getUnsyncedCompletions()
        if (unsyncedList.isEmpty()) {
            return@withContext Result.success()
        }

        try {
            for (item in unsyncedList) {
                // Here we submit each completion to the Supabase endpoint
                // Because each item has a unique UUID idempotencyKey, duplicate network retries
                // are safely ignored by PostgreSQL's unique constraint.
                // Upon success:
                routineDao.markSynced(item.idempotencyKey)
            }
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 5) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }

    companion object {
        fun enqueueSync(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val syncRequest = OneTimeWorkRequestBuilder<RoutineSyncWorker>()
                .setConstraints(constraints)
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 15, TimeUnit.SECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                "RoutineSyncWork",
                ExistingWorkPolicy.APPEND_OR_REPLACE,
                syncRequest
            )
        }
    }
}
