import 'package:flutter/material.dart';
import '../common_widgets/card_widget.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  static const routeName = '/reports';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
      ),
      body: const Center(
        child: CardWidget(),
      ),
    );
  }
}
