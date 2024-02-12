// ignore_for_file: library_private_types_in_public_api, must_be_immutable

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:exam/widgets/message.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import '../repositories/network.dart';
import '../services/data.dart';
import '../models/item.dart';

class ClientSection extends StatefulWidget {
  const ClientSection({Key? key}) : super(key: key);

  @override
  _MainSectionState createState() => _MainSectionState();
}

class _MainSectionState extends State<ClientSection> {
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
      body: SingleChildScrollView(
        child: Column(
          children: [
            const Text("Events", style: TextStyle(fontSize: 20)),
            Element(),
            const Text("Reserve Events", style: TextStyle(fontSize: 20)),
            Element2(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class Element extends StatelessWidget {
  var logger = Logger();
  bool online = true;
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  final NetworkConnectivity _connectivity = NetworkConnectivity.instance;
  String string = '';

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
  Element({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context);
    connection();
    return Column(
      children: [
        FutureBuilder<List<Item>>(
          future: dataService.getItems(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else {
              final dataAttributes = snapshot.data;
              return Padding(
                padding: const EdgeInsets.all(25),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var data in dataAttributes!)
                      ListTile(
                        title: Text(data.name),
                        subtitle: Text("Organizer: ${data.organizer}\nCategory: ${data.category}\n"),
                        onTap: () {
                            if (online) {
                              dataService.reserve(data.id!);
                              message(context, "Reserved", "Info");
                            } else {
                              message(context, "Reservation is available only when online", "Error");
                            }
                        },
                      ),
                  ],
                ),
              );
            }
          },
        )
      ],
    );
  }
}


class Element2 extends StatelessWidget {
  Element2({Key? key}) : super(key: key);
  var logger = Logger();
  bool online = true;
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  final NetworkConnectivity _connectivity = NetworkConnectivity.instance;
  String string = '';

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
    final dataService = Provider.of<DataService>(context);
    connection();
    return Column(
      children: [
        FutureBuilder<List<Item>>(
          future: dataService.getReservedEvents(),
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
                        title: Text(data.name),
                        subtitle: Text("Organizer: ${data.organizer}\nCategory: ${data.category}\n"),
                        onTap: () {
                            if (online) {
                              try {
                                dataService.attend(data.id!);
                                message(context, "Attend", "Info");
                              } catch(e) {
                                message(context, "Attend $e", "Error");
                              }
                            } else {
                              message(context, "Reservation is available only when online", "Error");
                            }
                        },
                      ),
                  ],
                ),
              );
            }
          },
        )
      ],
    );
  }
}
