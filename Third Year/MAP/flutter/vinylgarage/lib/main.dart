// main.dart
import 'package:flutter/material.dart';
import '../providers/record_provider.dart';
import '../ui/screens/main_record_screen.dart';
import '../ui/screens/new_record_screen.dart';
import 'package:provider/provider.dart';
import '../data_repository/db_helper.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await DBhelper.dbHelper.initDatabase();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<RecordProvider>(
          create: (context) => RecordProvider(),
        ),
      ],
      child: const InitApp(),
    );
  }
}

class InitApp extends StatelessWidget {
  const InitApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Vinyl Collection',
      theme: ThemeData(fontFamily: 'Roboto'),
      home: const MainRecordScreen(),
      routes: {
        '/new_record_screen': (context) => const NewRecordScreen(),
        '/main_record_screen': (context) => const MainRecordScreen(),
      },
    );
  }
}
