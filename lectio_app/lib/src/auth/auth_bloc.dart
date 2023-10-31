import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:lectio_app/src/auth/auth_state.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn googleSignIn = GoogleSignIn();

  AuthBloc() : super(AuthInitial()) {
    _checkSession();

    on<SignInWithGoogle>((event, emit) async {
      try {
        final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
        final GoogleSignInAuthentication googleAuth =
            await googleUser!.authentication;
        final AuthCredential credential = GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken,
          idToken: googleAuth.idToken,
        );
        final UserCredential userCredential =
            await _firebaseAuth.signInWithCredential(credential);
        final user = userCredential.user;
        _saveSession(user?.uid);
        emit(AuthSuccess(user!));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });
    on<SignInWithEmailAndPassword>((event, emit) async {
      try {
        // Access the email and password from the event
        final email = event.email;
        final password = event.password;

        // Implement your email/password authentication logic here
        // For example, you can use Firebase Authentication
        final userCredential = await _firebaseAuth.signInWithEmailAndPassword(
          email: email,
          password: password,
        );

        final user = userCredential.user;
        _saveSession(user?.uid);
        emit(AuthSuccess(user!));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });
    on<SignOut>((event, emit) async {
      try {
        // Implement the sign-out logic
        await _firebaseAuth.signOut(); // Sign out the user
        _clearSession();
        emit(AuthInitial()); // Transition to the initial state
      } catch (e) {
        emit(AuthFailure(e.toString())); // Handle sign-out failure
      }
    });
  }

  // Function to check and restore the user's session
  void _checkSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id');
    if (userId != null) {
      // User was previously authenticated, restore the session
      final user = await _firebaseAuth.currentUser;
      if (user != null) {
        emit(AuthSuccess(user));
      } else {
        // Session was invalid, clear it
        _clearSession();
      }
    }
  }

  // Function to save the session
  void _saveSession(String? userId) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('user_id', userId ?? "");
  }

  // Function to clear the session
  void _clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.remove('user_id');
  }
}
