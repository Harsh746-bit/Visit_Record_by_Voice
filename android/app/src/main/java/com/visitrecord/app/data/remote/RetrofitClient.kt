package com.visitrecord.app.data.remote

import android.content.Context
import com.visitrecord.app.data.local.TokenManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {

    private var apiServiceInstance: ApiService? = null
    private var currentBaseUrl: String? = null

    class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val original = chain.request()
            val token = tokenManager.getAccessToken()

            val requestBuilder = original.newBuilder()
            if (!token.isNullOrBlank()) {
                requestBuilder.header("Authorization", "Bearer $token")
            }
            requestBuilder.header("Accept", "application/json")
            return chain.proceed(requestBuilder.build())
        }
    }

    fun getApiService(context: Context): ApiService {
        val tokenManager = TokenManager(context)
        val baseUrl = tokenManager.getServerUrl().trimEnd('/') + "/"

        if (apiServiceInstance != null && currentBaseUrl == baseUrl) {
            return apiServiceInstance!!
        }

        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(tokenManager))
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        currentBaseUrl = baseUrl
        apiServiceInstance = retrofit.create(ApiService::class.java)
        return apiServiceInstance!!
    }
}
