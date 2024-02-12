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
  late TextEditingController typeController;
  late TextEditingController caloriesController;
  late TextEditingController dateController;
  late TextEditingController notesController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    typeController = TextEditingController();
    caloriesController = TextEditingController();
    dateController = TextEditingController();
    notesController = TextEditingController();
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
        child: Column(
          children: [
            TextBox(nameController, "Name"),
            TextBox(typeController, "Type"),
            TextBox(caloriesController, "Calories"),
            TextBox(dateController, "Date"),
            TextBox(notesController, "Notes"),
            ElevatedButton(
              onPressed: () async {
                String name = nameController.text;
                String type = typeController.text;
                int? calories = int.tryParse(caloriesController.text);
                String date = dateController.text;
                String notes = notesController.text;

                if (name.isNotEmpty &&
                    type.isNotEmpty &&
                    calories != null &&
                    isDateValid(date) &&
                    notes.isNotEmpty) {
                  final newItem = Item(
                    name: name,
                    type: type,
                    calories: calories,
                    date: date,
                    notes: notes,
                  );

                  if (dataService.online) {
                    try {
                      await dataService.addItem(newItem);
                      nameController.clear();
                      typeController.clear();
                      caloriesController.clear();
                      dateController.clear();
                      notesController.clear();
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
                  } else if (type.isEmpty) {
                    message(context, "Type is empty", "Error");
                  } else if (calories == null) {
                    message(context, "Calories is not valid", "Error");
                  } else if (!isDateValid(date)) {
                    message(context, "Date is not valid", "Error");
                  } else if (notes.isEmpty) {
                    message(context, "Notes is empty", "Error");
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
