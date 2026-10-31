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

    fun getUserId(): String = prefs.getString(KEY_USER_ID, "ASHA-PUN-104") ?: "ASHA-PUN-104"
    fun getUserName(): String = prefs.getString(KEY_USER_NAME, "रुक्मिणी जाधव") ?: "रुक्मिणी जाधव"
    fun getUserPhone(): String = prefs.getString(KEY_USER_PHONE, "+91 98810 99401") ?: "+91 98810 99401"
    fun getUserSubCenter(): String = prefs.getString(KEY_USER_SUB_CENTER, "खेड शिवापूर उपकेंद्र") ?: "खेड शिवापूर उपकेंद्र"
    fun getUserPhc(): String = prefs.getString(KEY_USER_PHC, "खेड शिवापूर प्रा.आ.केंद्र") ?: "खेड शिवापूर प्रा.आ.केंद्र"

    fun getServerUrl(): String = prefs.getString(KEY_SERVER_URL, DEFAULT_SERVER_URL) ?: DEFAULT_SERVER_URL

    fun setServerUrl(url: String) {
        prefs.edit().putString(KEY_SERVER_URL, url).apply()
    }

    fun isLoggedIn(): Boolean = !getAccessToken().isNullOrBlank()

    fun clearSession() {
        prefs.edit()
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .apply()
    }
}
