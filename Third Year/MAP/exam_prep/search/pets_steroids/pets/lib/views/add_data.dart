// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';

import '../models/item.dart';
import '../widgets/text_box.dart';
import '../services/data.dart';
import '../widgets/message.dart';

class AddData extends StatefulWidget {
  const AddData({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _AddDataState();
}

class _AddDataState extends State<AddData> {
  var logger = Logger();
  late TextEditingController nameController;
  late TextEditingController breedController;
  late TextEditingController ageController;
  late TextEditingController weightController;
  late TextEditingController ownerController;
  late TextEditingController locationController;
  late TextEditingController descriptionController;


  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    breedController = TextEditingController();
    ageController = TextEditingController();
    weightController = TextEditingController();
    ownerController = TextEditingController();
    locationController = TextEditingController();
    descriptionController = TextEditingController();
  }

  bool isDateValid(String date) {
    if (DateTime.tryParse(date) == null) {
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Data"),
      ),
      body: SingleChildScrollView(
        child: ListView(
          padding: const EdgeInsets.all(25),
          shrinkWrap: true,
          children: [
            TextBox(nameController, "Name"),
            TextBox(breedController, "Breed"),
            TextBox(ageController, "Age"),
            TextBox(weightController, "Weight"),
            TextBox(ownerController, "Owner"),
            TextBox(locationController, "Location"),
            TextBox(descriptionController, "Description"),
            ElevatedButton(
              onPressed: () async {
                String name = nameController.text;
                String breed = breedController.text;
                int? age = int.tryParse(ageController.text);
                int? weight = int.tryParse(weightController.text);
                String owner = ownerController.text;
                String location = locationController.text;
                String description = descriptionController.text;

                if (name.isNotEmpty &&
                    breed.isNotEmpty &&
                    age != null &&
                    weight != null &&
                    owner.isNotEmpty &&
                    location.isNotEmpty &&
                    description.isNotEmpty) {
                  final newItem = Item(
                    name: name,
                    breed: breed,
                    age: age,
                    weight: weight,
                    owner: owner,
                    location: location,
                    description: description
                  );

                  if (dataService.online) {
                    try {
                      await dataService.addItem(newItem);
                      nameController.clear();
                      breedController.clear();
                      ageController.clear();
                      weightController.clear();
                      ownerController.clear();
                      locationController.clear();
                      descriptionController.clear();
                    } catch (e) {
                      message(context, "Error when adding data", "Error");
                      logger.e(e);
                    }
                  } else {
                    message(context, "Operation not available offline", "Error");
                  }
                } else {
                  if (name.isEmpty) {
                    message(context, "Name is empty", "Error");
                  } else if (breed.isEmpty) {
                    message(context, "Breed is empty", "Error");
                  } else if (age == null) {
                    message(context, "Age is empty", "Error");
                  } else if (weight == null) {
                    message(context, "Weight is empty", "Error");
                  } else if (owner.isEmpty) {
                    message(context, "Owner is empty", "Error");
                  } else if (location.isEmpty) {
                    message(context, "Location is empty", "Error");
                  } else if (description.isEmpty) {
                    message(context, "Description is empty", "Error");
                  }
                }
              },
              child: const Text("Save"),
            )
          ],
        ),
      ),
    );
  }
}
