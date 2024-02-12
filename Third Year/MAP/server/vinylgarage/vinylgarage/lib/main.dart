import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/records_service.dart';
import '../views/home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  var service = await RecordsService.init();

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
    return const MaterialApp(
      title: 'Vinyl Garage',
      home: MyMainPage(),
    );
  }
}

class MyMainPage extends StatelessWidget {
  const MyMainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Collection'),
      ),
      body: const Column(
        children: [
          ConnectionStatusWidget(),
          Expanded(
            child: HomePageWidget(),
          ),
        ],
      ),
    );
  }
}

class ConnectionStatusWidget extends StatelessWidget {
  const ConnectionStatusWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<RecordsService>(
      builder: (context, service, child) {
        return Container(
          color: service.is_online ? Colors.green : Colors.red,
          width: double.infinity,
          padding: const EdgeInsets.all(8),
          child: Text(
            service.is_online ? 'Online' : 'Offline',
            style: const TextStyle(color: Colors.white),
            textAlign: TextAlign.center,
          ),
        );
      },
    );
  }
}
