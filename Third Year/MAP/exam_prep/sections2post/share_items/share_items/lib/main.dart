import 'package:flutter/material.dart';

import 'screens/homepage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Share Items',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const Homepage('Share Items'),
    );
  }
}
