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
  late TextEditingController dateController;
  late TextEditingController typeController;
  late TextEditingController durationController;
  late TextEditingController distanceController;
  late TextEditingController caloriesController;
  late TextEditingController rateController;

  @override
  void initState() {
    super.initState();
    dateController = TextEditingController();
    typeController = TextEditingController();
    durationController = TextEditingController();
    distanceController = TextEditingController();
    caloriesController = TextEditingController();
    rateController = TextEditingController();
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
            TextBox(dateController, "Date"),
            TextBox(typeController, "Type"),
            TextBox(durationController, "Duration"),
            TextBox(distanceController, "Distance"),
            TextBox(caloriesController, "Calories"),
            TextBox(rateController, "Rate"),
            ElevatedButton(
              onPressed: () async {
                  String date = dateController.text;
                  String type = typeController.text;
                  int? duration = int.tryParse(durationController.text);
                  int? distance = int.tryParse(distanceController.text);
                  int? calories = int.tryParse(caloriesController.text);
                  int? rate = int.tryParse(rateController.text);
                  if (isDateValid(date) &&
                      type.isNotEmpty &&
                      duration != null &&
                      distance != null &&
                      calories != null &&
                      rate != null) {
                      final newItem = Item(
                                date: date,
                                type: type,
                                duration: duration,
                                calories: calories,
                                distance: distance,
                                rate: rate);
                  if (dataService.online) {
                    try {
                      await dataService.addItem(newItem);
                      dateController.clear();
                      typeController.clear();
                      durationController.clear();
                      distanceController.clear();
                      caloriesController.clear();
                      rateController.clear();
                    } catch (e) {
                      message(context, "Error when adding data", "Error");
                      logger.e(e);
                    }
                  } else {
                    message(context, "Operation not available offline", "Error");
                  }
                } else {
                  if (!isDateValid(date)) {
                      message(context, "Date is not valid", "Error");
                    } else if (type.isEmpty) {
                      message(context, "Type is empty", "Error");
                    } else if (duration == null) {
                      message(context, "Duration is not valid", "Error");
                    } else if (distance == null) {
                      message(context, "Distance is not valid", "Error");
                    } else if (calories == null) {
                      message(context, "Calories is not valid", "Error");
                    } else if (rate == null) {
                      message(context, "Rate is not valid", "Error");
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
