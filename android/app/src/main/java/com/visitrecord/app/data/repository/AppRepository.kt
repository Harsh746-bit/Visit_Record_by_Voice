package com.visitrecord.app.data.repository

import android.content.Context
import com.visitrecord.app.data.local.DraftVisit
import com.visitrecord.app.data.local.DraftVisitDbHelper
import com.visitrecord.app.data.local.TokenManager
import com.visitrecord.app.data.remote.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AppRepository(private val context: Context) {

    private val apiService = RetrofitClient.getApiService(context)
    private val tokenManager = TokenManager(context)
    private val dbHelper = DraftVisitDbHelper(context)

    suspend fun login(phone: String, pin: String): Result<UserDto> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.login(LoginRequest(phone = phone, password = pin))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                tokenManager.saveTokens(body.accessToken, body.refreshToken)
                tokenManager.saveUser(body.user)
                Result.success(body.user)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Authentication failed (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun sendOtp(phone: String): Result<OtpSendResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.sendOtp(OtpSendRequest(phone = phone))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "OTP request failed (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun verifyOtp(phone: String, otp: String): Result<OtpVerifyResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.verifyOtp(OtpVerifyRequest(phone = phone, otp = otp))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "OTP verification failed (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun fetchBeneficiaries(query: String? = null): Result<List<BeneficiaryDto>> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getBeneficiaries(query)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!.beneficiaries)
            } else {
                Result.failure(Exception("Failed to fetch beneficiaries: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun extractClinicalRecord(
        transcript: String,
        beneficiaryId: String,
        language: String = "mr-IN"
    ): Result<ExtractResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.extractStructuredRecord(
                ExtractRequest(transcript = transcript, language = language, beneficiaryId = beneficiaryId)
            )
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Extraction failed: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun submitVisitRecord(
        request: CreateVisitRequest,
        draftId: String? = null
    ): Result<CreateVisitResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.submitVisitRecord(request)
            if (response.isSuccessful && response.body() != null) {
                if (draftId != null) {
                    dbHelper.updateSyncStatus(draftId, "SYNCED")
                }
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Submission failed: ${response.code()}"))
            }
        } catch (e: Exception) {
            // Save as local draft with SYNC_PENDING if network failure occurs
            if (draftId != null) {
                dbHelper.updateSyncStatus(draftId, "SYNC_PENDING")
            }
            Result.failure(e)
        }
    }

    fun saveLocalDraft(draft: DraftVisit): Long {
        return dbHelper.saveDraft(draft)
    }

    fun getLocalDrafts(): List<DraftVisit> {
        return dbHelper.getAllDrafts()
    }

    fun deleteLocalDraft(id: String) {
        dbHelper.deleteDraft(id)
    }

    fun getTokenManager(): TokenManager = tokenManager
}
