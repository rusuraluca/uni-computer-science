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
  late TextEditingController organizerController;
  late TextEditingController categoryController;
  late TextEditingController capacityController;
  late TextEditingController registeredController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    organizerController = TextEditingController();
    categoryController = TextEditingController();
    capacityController = TextEditingController();
    registeredController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Data"),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            TextBox(nameController, 'Name'),
            TextBox(organizerController, 'Organizer'),
            TextBox(categoryController, 'Category'),
            TextBox(capacityController, 'Capacity'),
            TextBox(registeredController, 'Registered'),
            ElevatedButton(
              onPressed: () async {
                String name = nameController.text;
                String organizer = organizerController.text;
                String category = categoryController.text;
                int? capacity = int.tryParse(capacityController.text);
                int? registered = int.tryParse(registeredController.text);
                if (name.isNotEmpty &&
                    organizer.isNotEmpty &&
                    category.isNotEmpty &&
                    capacity != null &&
                    registered != null) {
                      final newItem = Item(
                          name: name,
                          organizer: organizer,
                          category: category,
                          capacity: capacity,
                          registered: registered);
                  if (dataService.online) {
                    try {
                      await dataService.addItem(newItem);
                      nameController.clear();
                      organizerController.clear();
                      categoryController.clear();
                      capacityController.clear();
                      registeredController.clear();
                    } catch (e) {
                      message(context, "Error when adding data", "Error");
                      logger.e(e);
                    }
                  } else {
                    message(context, "Operation not available offline", "Error");
                  }
                } else {
                  // Add error messages for each field
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
