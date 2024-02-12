// ignore_for_file: library_private_types_in_public_api

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import '../repositories/network.dart';
import '../services/data.dart';
import '../views/item_page.dart';
import '../widgets/message.dart';
import 'add_data.dart';

class MainSection extends StatefulWidget {
  const MainSection({Key? key}) : super(key: key);

  @override
  _MainSectionState createState() => _MainSectionState();
}

class _MainSectionState extends State<MainSection> {
  var logger = Logger();
  bool online = true;
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  final NetworkConnectivity _connectivity = NetworkConnectivity.instance;
  String string = '';

  @override
  void initState() {
    super.initState();
    connection();
  }

  void connection() {
    _connectivity.initialize();
    _connectivity.myStream.listen((source) {
      _source = source;
      var newStatus = true;
      switch (_source.keys.toList()[0]) {
        case ConnectivityResult.mobile:
          string =
              _source.values.toList()[0] ? 'Mobile: online' : 'Mobile: offline';
          break;
        case ConnectivityResult.wifi:
          string =
              _source.values.toList()[0] ? 'Wifi: online' : 'Wifi: offline';
          newStatus = _source.values.toList()[0] ? true : false;
          break;
        case ConnectivityResult.none:
        default:
          string = 'Offline';
          newStatus = false;
      }
      if (online != newStatus) {
        online = newStatus;
      }
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Section'),
      ),
      body: const Column(
        children: [
          Expanded(
            child: Element(),
          ),
          SizedBox(height: 20),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (online) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const AddData(),
              ),
            );
          } else {
            message(context, "Cannot add data while offline.", "Error");
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class Element extends StatelessWidget {
  const Element({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context);
    return FutureBuilder<List<dynamic>>(
      future: dataService.getAttributes(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Text('No data available.');
        } else {
          final dataAttributes = snapshot.data!;
          return ListView.builder(
            itemCount: dataAttributes.length,
            itemBuilder: (context, index) {
              var data = dataAttributes[index];
              return ListTile(
                title: Text(data[1]),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ItemPage(data[0]),
                    ),
                  );
                },
              );
            },
          );
        }
      },
    );
  }
}
