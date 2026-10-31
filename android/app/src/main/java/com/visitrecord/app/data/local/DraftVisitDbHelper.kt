package com.visitrecord.app.data.local

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

data class DraftVisit(
    val id: String,
    val beneficiaryId: String,
    val beneficiaryName: String,
    val language: String,
    val transcript: String,
    val bpSystolic: Int?,
    val bpDiastolic: Int?,
    val weightKg: Float?,
    val hemoglobinGDl: Float?,
    val gestationalWeeks: Int?,
    val headache: Boolean,
    val pedalEdema: Boolean,
    val fetalMovementNormal: Boolean,
    val syncStatus: String, // "LOCAL_DRAFT", "SYNC_PENDING", "SYNCED"
    val createdAt: Long = System.currentTimeMillis()
)

class DraftVisitDbHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        const val DATABASE_NAME = "visit_record_drafts.db"
        const val DATABASE_VERSION = 1

        const val TABLE_NAME = "draft_visits"
        const val COL_ID = "id"
        const val COL_BENEFICIARY_ID = "beneficiary_id"
        const val COL_BENEFICIARY_NAME = "beneficiary_name"
        const val COL_LANGUAGE = "language"
        const val COL_TRANSCRIPT = "transcript"
        const val COL_BP_SYSTOLIC = "bp_systolic"
        const val COL_BP_DIASTOLIC = "bp_diastolic"
        const val COL_WEIGHT_KG = "weight_kg"
        const val COL_HEMOGLOBIN = "hemoglobin_g_dl"
        const val COL_GESTATIONAL_WEEKS = "gestational_weeks"
        const val COL_HEADACHE = "headache"
        const val COL_PEDAL_EDEMA = "pedal_edema"
        const val COL_FETAL_MOVEMENT = "fetal_movement_normal"
        const val COL_SYNC_STATUS = "sync_status"
        const val COL_CREATED_AT = "created_at"
    }

    override fun onCreate(db: SQLiteDatabase) {
        val createTableQuery = """
            CREATE TABLE $TABLE_NAME (
                $COL_ID TEXT PRIMARY KEY,
                $COL_BENEFICIARY_ID TEXT NOT NULL,
                $COL_BENEFICIARY_NAME TEXT NOT NULL,
                $COL_LANGUAGE TEXT NOT NULL,
                $COL_TRANSCRIPT TEXT,
                $COL_BP_SYSTOLIC INTEGER,
                $COL_BP_DIASTOLIC INTEGER,
                $COL_WEIGHT_KG REAL,
                $COL_HEMOGLOBIN REAL,
                $COL_GESTATIONAL_WEEKS INTEGER,
                $COL_HEADACHE INTEGER NOT NULL DEFAULT 0,
                $COL_PEDAL_EDEMA INTEGER NOT NULL DEFAULT 0,
                $COL_FETAL_MOVEMENT INTEGER NOT NULL DEFAULT 1,
                $COL_SYNC_STATUS TEXT NOT NULL DEFAULT 'LOCAL_DRAFT',
                $COL_CREATED_AT INTEGER NOT NULL
            )
        """.trimIndent()
        db.execSQL(createTableQuery)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }

    fun saveDraft(draft: DraftVisit): Long {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_ID, draft.id)
            put(COL_BENEFICIARY_ID, draft.beneficiaryId)
            put(COL_BENEFICIARY_NAME, draft.beneficiaryName)
            put(COL_LANGUAGE, draft.language)
            put(COL_TRANSCRIPT, draft.transcript)
            put(COL_BP_SYSTOLIC, draft.bpSystolic)
            put(COL_BP_DIASTOLIC, draft.bpDiastolic)
            put(COL_WEIGHT_KG, draft.weightKg)
            put(COL_HEMOGLOBIN, draft.hemoglobinGDl)
            put(COL_GESTATIONAL_WEEKS, draft.gestationalWeeks)
            put(COL_HEADACHE, if (draft.headache) 1 else 0)
            put(COL_PEDAL_EDEMA, if (draft.pedalEdema) 1 else 0)
            put(COL_FETAL_MOVEMENT, if (draft.fetalMovementNormal) 1 else 0)
            put(COL_SYNC_STATUS, draft.syncStatus)
            put(COL_CREATED_AT, draft.createdAt)
        }
        return db.insertWithOnConflict(TABLE_NAME, null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun getAllDrafts(): List<DraftVisit> {
        val list = mutableListOf<DraftVisit>()
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT * FROM $TABLE_NAME ORDER BY $COL_CREATED_AT DESC", null)
        cursor.use { c ->
            while (c.moveToNext()) {
                list.add(
                    DraftVisit(
                        id = c.getString(c.getColumnIndexOrThrow(COL_ID)),
                        beneficiaryId = c.getString(c.getColumnIndexOrThrow(COL_BENEFICIARY_ID)),
                        beneficiaryName = c.getString(c.getColumnIndexOrThrow(COL_BENEFICIARY_NAME)),
                        language = c.getString(c.getColumnIndexOrThrow(COL_LANGUAGE)),
                        transcript = c.getString(c.getColumnIndexOrThrow(COL_TRANSCRIPT)) ?: "",
                        bpSystolic = if (c.isNull(c.getColumnIndexOrThrow(COL_BP_SYSTOLIC))) null else c.getInt(c.getColumnIndexOrThrow(COL_BP_SYSTOLIC)),
                        bpDiastolic = if (c.isNull(c.getColumnIndexOrThrow(COL_BP_DIASTOLIC))) null else c.getInt(c.getColumnIndexOrThrow(COL_BP_DIASTOLIC)),
                        weightKg = if (c.isNull(c.getColumnIndexOrThrow(COL_WEIGHT_KG))) null else c.getFloat(c.getColumnIndexOrThrow(COL_WEIGHT_KG)),
                        hemoglobinGDl = if (c.isNull(c.getColumnIndexOrThrow(COL_HEMOGLOBIN))) null else c.getFloat(c.getColumnIndexOrThrow(COL_HEMOGLOBIN)),
                        gestationalWeeks = if (c.isNull(c.getColumnIndexOrThrow(COL_GESTATIONAL_WEEKS))) null else c.getInt(c.getColumnIndexOrThrow(COL_GESTATIONAL_WEEKS)),
                        headache = c.getInt(c.getColumnIndexOrThrow(COL_HEADACHE)) == 1,
                        pedalEdema = c.getInt(c.getColumnIndexOrThrow(COL_PEDAL_EDEMA)) == 1,
                        fetalMovementNormal = c.getInt(c.getColumnIndexOrThrow(COL_FETAL_MOVEMENT)) == 1,
                        syncStatus = c.getString(c.getColumnIndexOrThrow(COL_SYNC_STATUS)),
                        createdAt = c.getLong(c.getColumnIndexOrThrow(COL_CREATED_AT))
                    )
                )
            }
        }
        return list
    }

    fun updateSyncStatus(id: String, newStatus: String) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_SYNC_STATUS, newStatus)
        }
        db.update(TABLE_NAME, values, "$COL_ID = ?", arrayOf(id))
    }

    fun deleteDraft(id: String) {
        val db = writableDatabase
        db.delete(TABLE_NAME, "$COL_ID = ?", arrayOf(id))
    }
}
