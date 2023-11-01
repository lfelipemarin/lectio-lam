import 'package:flutter/material.dart';

class CardWidget extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget cardBody;

  const CardWidget({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    required this.cardBody,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4, // Shadow elevation
      margin: const EdgeInsets.all(16), // Margin around the card
      child: Column(
        children: <Widget>[
          ListTile(
            title: Text(title),
            subtitle: subtitle != null ? Text(subtitle!) : null,
            leading: leading,
          ),
          const Divider(), // A divider line
          SizedBox(
            height: 400,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: cardBody,
            ),
          )
        ],
      ),
    );
  }
}
