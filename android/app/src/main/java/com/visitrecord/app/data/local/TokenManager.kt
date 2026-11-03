package com.visitrecord.app.data.local

import android.content.Context
import android.content.SharedPreferences
import com.visitrecord.app.data.remote.UserDto

class TokenManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREF_NAME = "visit_record_secure_prefs"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_PHONE = "user_phone"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_USER_SUB_CENTER = "user_sub_center"
        private const val KEY_USER_PHC = "user_phc"
        private const val KEY_SERVER_URL = "server_url"
        private const val KEY_PRODUCTION_MODE = "is_production_mode"
        private const val DEFAULT_SERVER_URL = "http://10.0.2.2:8000" // Android Emulator to Host localhost
    }

    fun saveTokens(accessToken: String, refreshToken: String) {
        prefs.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply()
    }

    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)

    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH_TOKEN, null)

    fun isProductionMode(): Boolean = prefs.getBoolean(KEY_PRODUCTION_MODE, false)

    fun setProductionMode(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_PRODUCTION_MODE, enabled).apply()
    }

    fun saveUser(user: UserDto) {
        prefs.edit()
            .putString(KEY_USER_ID, user.id)
            .putString(KEY_USER_NAME, user.fullNameMr ?: user.fullName)
            .putString(KEY_USER_PHONE, user.phone)
            .putString(KEY_USER_ROLE, user.role)
            .putString(KEY_USER_SUB_CENTER, user.subCenter ?: "खेड शिवापूर उपकेंद्र")
            .putString(KEY_USER_PHC, user.phc ?: "खेड शिवापूर प्रा.आ.केंद्र")
            .apply()
    }

    fun getUserId(): String? = prefs.getString(KEY_USER_ID, null)
    fun getUserName(): String? = prefs.getString(KEY_USER_NAME, null)
    fun getUserPhone(): String? = prefs.getString(KEY_USER_PHONE, null)
    fun getUserSubCenter(): String? = prefs.getString(KEY_USER_SUB_CENTER, null)
    fun getUserPhc(): String? = prefs.getString(KEY_USER_PHC, null)

    fun getServerUrl(): String = prefs.getString(KEY_SERVER_URL, DEFAULT_SERVER_URL) ?: DEFAULT_SERVER_URL

    fun setServerUrl(url: String) {
        prefs.edit().putString(KEY_SERVER_URL, url).apply()
    }

    fun isLoggedIn(): Boolean = !getAccessToken().isNullOrBlank()

    fun clearSession() {
        prefs.edit()
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .remove(KEY_USER_ID)
            .remove(KEY_USER_NAME)
            .remove(KEY_USER_PHONE)
            .remove(KEY_USER_ROLE)
            .remove(KEY_USER_SUB_CENTER)
            .remove(KEY_USER_PHC)
            .apply()
    }
}
