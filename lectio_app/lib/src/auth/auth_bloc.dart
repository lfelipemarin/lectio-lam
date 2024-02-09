import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:lectio_app/src/auth/auth_state.dart';
import 'package:lectio_app/src/sesssion/session_manager.dart'; // Import SessionManager
import 'package:lectio_app/src/sesssion/user_session.dart';

import 'auth_event.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  AuthBloc() : super(AuthInitial()) {
    _checkSession();

    on<SignInWithGoogle>((event, emit) async {
      try {
        final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
        final GoogleSignInAuthentication googleAuth =
            await googleUser!.authentication;
        final AuthCredential credential = GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken,
          idToken: googleAuth.idToken,
        );
        final UserCredential userCredential =
            await _firebaseAuth.signInWithCredential(credential);
        final user = userCredential.user;
        final userSession = UserSession(
          userId: user?.uid,
          userName: user?.displayName,
          userEmail: user?.email,
        );
        _saveSession(userSession);
        emit(AuthSuccess(user!));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });

    on<SignInWithEmailAndPassword>((event, emit) async {
      try {
        final email = event.email;
        final password = event.password;

        final userCredential = await _firebaseAuth.signInWithEmailAndPassword(
          email: email,
          password: password,
        );

        final user = userCredential.user;
        final userSession = UserSession(
          userId: user?.uid,
          userName: user?.displayName,
          userEmail: user?.email,
        );
        _saveSession(userSession); // Save user data
        emit(AuthSuccess(user!));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });

    on<SignOut>((event, emit) async {
      try {
        await _firebaseAuth.signOut();
        _clearSession();
        emit(AuthInitial());
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });
  }

  void _checkSession() async {
    final userSession = await SessionManager.getUserSession();
    if (userSession != null && userSession.userId != null) {
      final user = await _firebaseAuth.currentUser;
      if (user != null) {
        emit(AuthSuccess(user));
      } else {
        SessionManager.clearSession();
      }
    }
  }

  void _saveSession(UserSession userSession) async {
    await SessionManager.saveUserSession(userSession);
  }

  void _clearSession() async {
    await SessionManager.clearSession();
  }
}
