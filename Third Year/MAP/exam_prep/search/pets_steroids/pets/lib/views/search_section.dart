// ignore_for_file: library_private_types_in_public_api, use_build_context_synchronously

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import '../repositories/network.dart';
import '../widgets/message.dart';
import '../models/item.dart';
import '../services/data.dart';

class SearchSection extends StatefulWidget {
  const SearchSection({super.key});

  @override
  _SearchSectionState createState() => _SearchSectionState();
}

class _SearchSectionState extends State<SearchSection> {
  var logger = Logger();
  bool online = true;
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  final NetworkConnectivity _connectivity = NetworkConnectivity.instance;
  String string = '';

  late List<Item> searchedItems = [];
  TextEditingController criteriaValueController = TextEditingController();

  //TODO: CHANGE THIS
  String selectedCriteria = 'breed';
  List<String> criteriaOptions = ['breed', 'age', 'location', 'weight'];

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

  void performSearch() async {
    final dataService = Provider.of<DataService>(context, listen: false);
    setState(() {
      isLoading = true;
    });

    try {
      if (online) {
        String criteriaValue = criteriaValueController.text;
        searchedItems = await dataService.search(selectedCriteria, criteriaValue);
      } else {
        message(context, "No internet connection", "Error");
      }
    } catch (e) {
      logger.log(Level.error, e.toString());
      message(context, "Error searching pets", "Error");
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Center(
              child: Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.all(10.0),
                      decoration: BoxDecoration(
                        border: Border.all(width: 0.5),
                        borderRadius: BorderRadius.circular(2.0),
                      ),
                      child: DropdownButtonFormField<String>(
                        value: selectedCriteria,
                        onChanged: (newValue) {
                          setState(() {
                            selectedCriteria = newValue!;
                          });
                        },
                        items: criteriaOptions.map<DropdownMenuItem<String>>(
                          (String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          },
                        ).toList(),
                        decoration: const InputDecoration(
                          labelText: 'Criteria (e.g., breed, age, location, weight)',
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    // Input field for criteria value
                    Container(
                      padding: const EdgeInsets.all(10.0),
                      child: TextField(
                        controller: criteriaValueController,
                        decoration: const InputDecoration(
                          labelText: 'Criteria Value',
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: performSearch,
                      child: const Text('Search'),
                    ),
                    // Display search results
                    Expanded(
                      child: ListView.builder(
                        itemCount: searchedItems.length,
                        itemBuilder: (context, index) {
                          var pet = searchedItems[index];
                          return ListTile(
                            title: Text('Name: ${pet.name}'),
                            subtitle: Text('Age: ${pet.age}, Weight: ${pet.weight}, Breed: ${pet.breed}, Location: ${pet.location}'),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }


  @override
  void dispose() {
    super.dispose();
  }
}