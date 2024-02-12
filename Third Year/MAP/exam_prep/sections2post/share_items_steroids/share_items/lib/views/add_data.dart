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
  late TextEditingController descriptionController;
  late TextEditingController imageController;
  late TextEditingController categoryController;
  late TextEditingController unitsController;
  late TextEditingController priceController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    descriptionController = TextEditingController();
    imageController = TextEditingController();
    categoryController = TextEditingController();
    unitsController = TextEditingController();
    priceController = TextEditingController();
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
            TextBox(nameController, 'Name'),
            TextBox(descriptionController, 'Description'),
            TextBox(imageController, 'Image'),
            TextBox(categoryController, 'Category'),
            TextBox(unitsController, 'Units'),
            TextBox(priceController, 'Price'),
            ElevatedButton(
              onPressed: () async {
                String name = nameController.text;
                String description = descriptionController.text;
                String image = imageController.text;
                String category = categoryController.text;
                int? units = int.tryParse(unitsController.text);
                double? price = double.tryParse(priceController.text);
                if (name.isNotEmpty &&
                    description.isNotEmpty &&
                    image.isNotEmpty &&
                    category.isNotEmpty &&
                    units != null &&
                    price != null) {
                      final newItem = Item(
                          name: name,
                          description: description,
                          image: image,
                          category: category,
                          units: units,
                          price: price);
                  if (dataService.online) {
                    try {
                      await dataService.addItem(newItem);
                      nameController.clear();
                      descriptionController.clear();
                      imageController.clear();
                      categoryController.clear();
                      unitsController.clear();
                      priceController.clear();
                    } catch (e) {
                      message(context, "Error when adding data", "Error");
                      logger.e(e);
                    }
                  } else {
                    message(context, "Operation not available offline", "Error");
                  }
                } else {
                  if (name.isEmpty) {
                    message(context, 'Name is required', "Error");
                  } else if (description.isEmpty) {
                    message(context, 'Description is required', "Error");
                  } else if (image.isEmpty) {
                    message(context, 'Image is required', "Error");
                  } else if (category.isEmpty) {
                    message(context, 'Category is required', "Error");
                  } else if (units == null) {
                    message(context, 'Units must be an integer', "Error");
                  } else if (price == null) {
                    message(context, 'Price must be a double', "Error");
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
