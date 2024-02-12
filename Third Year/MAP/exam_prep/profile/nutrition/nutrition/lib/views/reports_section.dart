// ignore_for_file: use_key_in_widget_constructors, library_private_types_in_public_api, no_leading_underscores_for_local_identifiers

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import '../models/item.dart';
import '../repositories/network.dart';
import '../services/data.dart';
import '../widgets/message.dart';

class ReportsSection extends StatefulWidget {
  @override
  _ReportsSectionState createState() => _ReportsSectionState();
}

class _ReportsSectionState extends State<ReportsSection> {
  var logger = Logger();
  bool online = true;
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  final NetworkConnectivity _connectivity = NetworkConnectivity.instance;
  String string = '';

  Future<List<Item>>? futureItems;
  TextEditingController startDateController = TextEditingController();
  TextEditingController endDateController = TextEditingController();

  @override
  void initState() {
    super.initState();
    connection();
  }

  void connection() {
    _connectivity.initialize();
    _connectivity.myStream.listen((source) {
      _source = source;
      logger.log(Level.info, _source);
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
      logger.log(Level.info, "Connection status: $online, $newStatus");
      if (online != newStatus) {
        online = newStatus;
        if (newStatus) {
          message(context, "Connection restored", "Info");
        } else {
          message(context, "Connection lost", "Info");
        }
      }
    });
  }

  bool isDateValid(String date) {
    if (DateTime.tryParse(date) == null) {
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final _dataService = Provider.of<DataService>(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports Section'),
      ),
      body: ListView(
              padding: const EdgeInsets.all(25),
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text('Top Items:', style: TextStyle(fontWeight: FontWeight.bold),),
                    ),
                    FutureBuilder<List<Item>>(
                      future: _dataService.getTopXItems(10),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        if (snapshot.hasError) {
                          return Text('Error: ${snapshot.error}');
                        }
                        if (!snapshot.hasData || snapshot.data!.isEmpty) {
                          return const Text('No data');
                        }
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: snapshot.data!
                            .map((item) => Text("${item.name} ${item.calories.toString()}"))
                            .toList(),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text('Total Calories By Type:', style: TextStyle(fontWeight: FontWeight.bold),),
                    ),
                    FutureBuilder<Map<String, int>>(
                      future: _dataService.getTotalCaloriesByType(),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        if (snapshot.hasError) {
                          return Text('Error: ${snapshot.error}');
                        }
                        if (!snapshot.hasData || snapshot.data!.isEmpty) {
                          return const Text('No data');
                        }
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: snapshot.data!.entries
                            .map((entry) => Text("${entry.key} ${entry.value.toString()}"))
                            .toList(),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text('Get Meals by Date Range:', style: TextStyle(fontWeight: FontWeight.bold),),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: _buildDateTextField(
                            controller: startDateController,
                            label: 'Start Date'
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildDateTextField(
                            controller: endDateController,
                            label: 'End Date'
                          ),
                        ),
                      ],
                    ),
                    _buildGetMealsButton(context),
                    _buildMealsList(),
                  ],
                ),
              ]
              ),
      );
    }

    Widget _buildDateTextField({required TextEditingController controller, required String label}) {
      return TextField(
        controller: controller,
        decoration: InputDecoration(labelText: label),
      );
    }

    Widget _buildGetMealsButton(BuildContext context) {
      return ElevatedButton(
        onPressed: () => _handleGetMealsButtonPress(context),
        child: const Text('Get Meals'),
      );
    }

    void _handleGetMealsButtonPress(BuildContext context) {
      final _dataService = Provider.of<DataService>(context, listen: false);
      setState(() {
        futureItems = _dataService.getMealsByDateRange(
          startDateController.text,
          endDateController.text,
        );
      });
    }

    Widget _buildMealsList() {
      return futureItems != null
        ? FutureBuilder<List<Item>>(
            future: futureItems,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: snapshot.data!
                    .map((item) => Text("${item.name} ${item.type} ${item.calories} ${item.date}"))
                    .toList(),
                );
              } else if (snapshot.hasError) {
                return Text('Error: ${snapshot.error}');
              }
              return const CircularProgressIndicator();
            },
          )
        : Container();
    }

  @override
  void dispose() {
    super.dispose();
    startDateController.dispose();
    endDateController.dispose();
  }
}
