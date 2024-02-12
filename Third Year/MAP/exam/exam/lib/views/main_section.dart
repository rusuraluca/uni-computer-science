// ignore_for_file: library_private_types_in_public_api

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import '../repositories/network.dart';
import '../services/data.dart';
import '../models/item.dart';
import '../views/add_data.dart';
import '../widgets/message.dart';

class EmployeeSection extends StatefulWidget {
  const EmployeeSection({super.key});

  @override
  _EmployeeSectionState createState() => _EmployeeSectionState();
}

class _EmployeeSectionState extends State<EmployeeSection> {
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
        title: const Text('Employee Section'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(25.0),
        children: const [
          Element(),
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
  @override
    void dispose() {
      super.dispose();
    }
}


class Element extends StatelessWidget {
  const Element({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context);
    return FutureBuilder<List<Item>>(
      future: dataService.getItems(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Text('No data available.');
        } else {
          final allData = snapshot.data;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (var data in allData!)
                ListTile(
                  title: Text(data.name),
                  subtitle: Text(
                    'Organizer: ${data.organizer}, Category: ${data.category}, Capacity: ${data.capacity}, Registered: ${data.registered}',
                  ),
                ),
            ],
          );
        }
      },
    );
  }
}
