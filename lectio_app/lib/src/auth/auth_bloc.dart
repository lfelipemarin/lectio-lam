import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:lectio_app/src/auth/auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn googleSignIn = GoogleSignIn();

  AuthBloc() : super(AuthInitial()) {
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
        emit(AuthSuccess(user!));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });
    on<SignOut>((event, emit) async {
      try {
        // Implement the sign-out logic
        await _firebaseAuth.signOut(); // Sign out the user
        emit(AuthInitial()); // Transition to the initial state
      } catch (e) {
        emit(AuthFailure(e.toString())); // Handle sign-out failure
      }
    });
  }
}
