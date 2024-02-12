import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'views/homepage.dart';
import 'services/data.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  var service = await DataService.init();

  runApp(
    ChangeNotifierProvider(
      create: (_) => service,
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Nutrition', // TODO: CHANGE HERE
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const Homepage('Nutrition'), //TODO: CHANGE HERE
      );
  }
}
