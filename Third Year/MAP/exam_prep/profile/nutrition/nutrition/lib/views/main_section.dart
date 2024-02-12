// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/data.dart';
import '../views/item_page.dart';

class MainSection extends StatefulWidget {
  const MainSection({Key? key}) : super(key: key);

  @override
  _MainSectionState createState() => _MainSectionState();
}

class _MainSectionState extends State<MainSection> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Section'),
      ),
      body: const Column(
        children: [
          Element(),
          SizedBox(height: 20),
        ],
      ),
    );
  }
}

class Element extends StatelessWidget {
  const Element({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context);
    return FutureBuilder<List<String>>(
      future: dataService.getAttributes(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Text('No data available.');
        } else {
          final dataAttributes = snapshot.data;
          return Padding(
            padding: const EdgeInsets.all(25),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (var data in dataAttributes!)
                  ListTile(
                    title: Text(data),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ItemPage(data),
                        ),
                      ).then((value) {});
                    },
                  ),
              ],
            ),
          );
        }
      },
    );
  }
}
