import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

import '../api/api.dart';
import '../api/network.dart';
import '../widgets/message.dart';
import '../models/item.dart';

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

  late List<Pet> searchedPets = [];

  TextEditingController criteriaValueController = TextEditingController();

  String selectedCriteria = 'breed';
  List<String> criteriaOptions = ['breed', 'age', 'location', 'weight']; // Criteria options

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
    setState(() {
      isLoading = true;
    });

    try {
      if (online) {
        String criteriaValue = criteriaValueController.text;
        searchedPets = await ApiService.instance.searchPet(selectedCriteria, criteriaValue);
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
        title: const Text('Search Pets'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Center(
              child: Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(20.0), // Adjust the padding as needed
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    // DropdownButtonFormField for selecting criteria
                    Container(
                      padding: const EdgeInsets.all(10.0), // Add padding to the input field
                      decoration: BoxDecoration(
                        border: Border.all(width: 0.5), // Add border
                        borderRadius: BorderRadius.circular(2.0), // Add border radius
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
                          border: InputBorder.none, // Remove input field border
                        ),
                      ),
                    ),
                    // Input field for criteria value
                    Container(
                      padding: const EdgeInsets.all(10.0), // Add padding to the input field
                      child: TextField(
                        controller: criteriaValueController,
                        decoration: const InputDecoration(
                          labelText: 'Criteria Value',
                          border: InputBorder.none, // Remove input field border
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
                        itemCount: searchedPets.length,
                        itemBuilder: (context, index) {
                          var pet = searchedPets[index];
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