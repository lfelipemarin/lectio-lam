import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'auth_bloc.dart';
import 'auth_state.dart'; // Import your authentication BLoC and related classes

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Authentication Example'),
      ),
      body: BlocProvider(
        create: (context) =>
            AuthBloc(), // Replace with your actual AuthBloc creation
        child: const AuthContent(),
      ),
    );
  }
}

class AuthContent extends StatelessWidget {
  const AuthContent({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        if (state is AuthInitial) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    context.read<AuthBloc>().add(SignInWithGoogle());
                  },
                  child: const Text('Sign in with Google'),
                ),
                const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('OR'),
                ),
                const TextField(
                  decoration: InputDecoration(labelText: 'Email'),
                ),
                const TextField(
                  decoration: InputDecoration(labelText: 'Password'),
                  obscureText: true,
                ),
                ElevatedButton(
                  onPressed: () async {
                    // Get the email and password from text fields
                    String email =
                        "lfelipe.marin@gmail.com"; // Replace with user input
                    String password = "JMJ2019!"; // Replace with user input
                    context.read<AuthBloc>().add(SignInWithEmailAndPassword(
                        email: email, password: password));
                  },
                  child: const Text('Sign in with Email'),
                ),
              ],
            ),
          );
        } else if (state is AuthSuccess) {
          return UserProfileWidget(user: state.user);
        } else if (state is AuthFailure) {
          return Center(
            child: Text('Authentication Error: ${state.error}'),
          );
        }
        return Container();
      },
    );
  }
}

class UserProfileWidget extends StatelessWidget {
  final User user;

  const UserProfileWidget({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Welcome, ${user.displayName}!'),
        ElevatedButton(
          onPressed: () {
            context.read<AuthBloc>().add(SignOut());
          },
          child: const Text('Sign Out'),
        ),
      ],
    );
  }
}
