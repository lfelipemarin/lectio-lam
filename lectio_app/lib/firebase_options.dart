// File generated by FlutterFire CLI.
// ignore_for_file: lines_longer_than_80_chars, avoid_classes_with_only_static_members
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        return linux;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyBC2YelAC40HL2gddAdYr4_gONtIUvlL3U',
    appId: '1:485166763553:web:5d0080146713de4baa1d60',
    messagingSenderId: '485166763553',
    projectId: 'sizzling-heat-354',
    authDomain: 'sizzling-heat-354.firebaseapp.com',
    databaseURL: 'https://sizzling-heat-354.firebaseio.com',
    storageBucket: 'sizzling-heat-354.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyAnUH-VbCZB1QRaMyFj748cggoKt8WIjO4',
    appId: '1:485166763553:android:e442d145c26c9ec8aa1d60',
    messagingSenderId: '485166763553',
    projectId: 'sizzling-heat-354',
    databaseURL: 'https://sizzling-heat-354.firebaseio.com',
    storageBucket: 'sizzling-heat-354.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAXl9ACHRe8OLMcCYJqfcO0BwFbSsQwcTY',
    appId: '1:485166763553:ios:78cdfb425874a459aa1d60',
    messagingSenderId: '485166763553',
    projectId: 'sizzling-heat-354',
    databaseURL: 'https://sizzling-heat-354.firebaseio.com',
    storageBucket: 'sizzling-heat-354.appspot.com',
    androidClientId:
        '485166763553-01dremf2mv8asc1qdn7oemltsad1vatj.apps.googleusercontent.com',
    iosClientId:
        '485166763553-4icafr6166ige8hmcjm9uh9nisrm50j6.apps.googleusercontent.com',
    iosBundleId: 'com.example.lectioApp',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyAXl9ACHRe8OLMcCYJqfcO0BwFbSsQwcTY',
    appId: '1:485166763553:ios:fe8213b7f66e5124aa1d60',
    messagingSenderId: '485166763553',
    projectId: 'sizzling-heat-354',
    databaseURL: 'https://sizzling-heat-354.firebaseio.com',
    storageBucket: 'sizzling-heat-354.appspot.com',
    androidClientId:
        '485166763553-01dremf2mv8asc1qdn7oemltsad1vatj.apps.googleusercontent.com',
    iosClientId:
        '485166763553-vp5cfi0l5299casdpj6heif18ecinajq.apps.googleusercontent.com',
    iosBundleId: 'com.example.lectioApp.RunnerTests',
  );

  static const FirebaseOptions linux = FirebaseOptions(
    apiKey: 'AIzaSyBC2YelAC40HL2gddAdYr4_gONtIUvlL3U',
    appId: '1:485166763553:web:5d0080146713de4baa1d60',
    messagingSenderId: '485166763553',
    projectId: 'sizzling-heat-354',
    authDomain: 'sizzling-heat-354.firebaseapp.com',
    databaseURL: 'https://sizzling-heat-354.firebaseio.com',
    storageBucket: 'sizzling-heat-354.appspot.com',
  );
}
