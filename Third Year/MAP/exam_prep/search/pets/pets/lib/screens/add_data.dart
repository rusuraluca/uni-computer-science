import '../models/item.dart';
import '../widgets/text_box.dart';
import 'package:flutter/material.dart';

import '../widgets/message.dart';

class AddData extends StatefulWidget {
  const AddData({super.key});

  @override
  State<StatefulWidget> createState() => _AddDataState();
}

class _AddDataState extends State<AddData> {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Add pet"),
        ),
        body: ListView(
          children: [
            TextBox(nameController, "Name"),
            TextBox(breedController, "Breed"),
            TextBox(ageController, "Age"),
            TextBox(weightController, "Weight"),
            TextBox(ownerController, "Owner"),
            TextBox(locationController, "Location"),
            TextBox(descriptionController, "Description"),
            ElevatedButton(
                onPressed: () {
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
                    Navigator.pop(
                        context,
                        Pet(
                            name: name,
                            breed: breed,
                            age: age,
                            weight: weight,
                            owner: owner,
                            location: location,
                            description: description));
                  } else {
                    if (name.isEmpty) {
                      message(context, "Name is empty", "Error");
                    } else if (breed.isEmpty) {
                      message(context, "Breed is empty", "Error");
                    } else if (age == null) {
                      message(context, "Age is not valid", "Error");
                    } else if (weight == null) {
                      message(context, "Weight is not valid", "Error");
                    } else if (owner.isEmpty) {
                      message(context, "Owner is empty", "Error");
                    } else if (location.isEmpty) {
                      message(context, "Location is empty", "Error");
                    } else if (description.isEmpty) {
                      message(context, "Description is empty", "Error");
                    }
                  }
                },
                child: const Text("Save"))
          ],
        ));
  }
}
