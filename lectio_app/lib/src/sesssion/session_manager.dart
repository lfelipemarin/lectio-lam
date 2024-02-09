import 'dart:convert';

import 'package:lectio_app/src/sesssion/user_session.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static const String _userSessionKey = 'user_session';

  static Future<UserSession?> getUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString(_userSessionKey);
    if (userData != null) {
      final decodedData = jsonDecode(userData);
      return UserSession(
        userId: decodedData['userId'],
        userName: decodedData['userName'],
        userEmail: decodedData['userEmail'],
      );
    }
    return null;
  }

  static Future<void> saveUserSession(UserSession userSession) async {
    final prefs = await SharedPreferences.getInstance();
    final userData = jsonEncode({
      'userId': userSession.userId,
      'userName': userSession.userName,
      'userEmail': userSession.userEmail,
    });
    prefs.setString(_userSessionKey, userData);
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.remove(_userSessionKey);
  }
}
