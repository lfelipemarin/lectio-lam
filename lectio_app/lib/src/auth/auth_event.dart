abstract class AuthEvent {}

class SignInWithGoogle extends AuthEvent {}

class SignInWithEmailAndPassword extends AuthEvent {
  final String email;
  final String password;

  SignInWithEmailAndPassword({required this.email, required this.password});
}

class SignOut extends AuthEvent {}
