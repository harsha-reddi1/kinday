package app.kinday.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [RoutineEntity::class, RoutineCompletionEntity::class],
    version = 1,
    exportSchema = false
)
abstract class KinDayDatabase : RoomDatabase() {
    abstract fun routineDao(): RoutineDao

    companion object {
        @Volatile
        private var INSTANCE: KinDayDatabase? = null

        fun getDatabase(context: Context): KinDayDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    KinDayDatabase::class.java,
                    "kinday_offline.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
