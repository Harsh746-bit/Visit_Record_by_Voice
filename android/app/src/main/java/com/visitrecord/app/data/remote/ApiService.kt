package com.visitrecord.app.data.remote

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @POST("/api/v1/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<LoginResponse>

    @POST("/api/v1/auth/otp/send")
    suspend fun sendOtp(
        @Body request: OtpSendRequest
    ): Response<OtpSendResponse>

    @POST("/api/v1/auth/otp/verify")
    suspend fun verifyOtp(
        @Body request: OtpVerifyRequest
    ): Response<OtpVerifyResponse>

    @POST("/api/v1/auth/refresh")
    suspend fun refreshToken(
        @Body request: RefreshRequest
    ): Response<RefreshResponse>

    @GET("/api/v1/auth/me")
    suspend fun getCurrentUser(): Response<UserDto>

    @GET("/api/v1/beneficiaries")
    suspend fun getBeneficiaries(
        @Query("query") query: String? = null
    ): Response<BeneficiariesResponse>

    @POST("/api/v1/visits/extract")
    suspend fun extractStructuredRecord(
        @Body request: ExtractRequest
    ): Response<ExtractResponse>

    @POST("/api/v1/visits")
    suspend fun submitVisitRecord(
        @Body request: CreateVisitRequest
    ): Response<CreateVisitResponse>

    @GET("/api/v1/visits")
    suspend fun getVisits(
        @Query("status") status: String? = null,
        @Query("beneficiary_id") beneficiaryId: String? = null,
        @Query("asha_id") ashaId: String? = null
    ): Response<VisitsListResponse>
}
