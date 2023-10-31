import 'package:flutter/material.dart';

class CardWidget extends StatelessWidget {
  const CardWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Material Card Example'),
      ),
      body: const Center(
        child: Card(
          elevation: 4, // Shadow elevation
          margin: EdgeInsets.all(16), // Margin around the card
          child: Column(
            children: <Widget>[
              ListTile(
                title: Text('Card Title'),
                subtitle: Text('Subtitle'),
                leading: Icon(Icons.account_circle),
              ),
              Divider(), // A divider line
              Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'This is some sample card content. You can put any content here, such as text, images, or other widgets.',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
