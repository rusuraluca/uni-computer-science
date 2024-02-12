import 'package:fitness_tracker/models/fitness_data.dart';
import 'package:fitness_tracker/widgets/text_box.dart';
import 'package:flutter/material.dart';

import '../widgets/message.dart';

class AddData extends StatefulWidget {
  const AddData({super.key});

  @override
  State<StatefulWidget> createState() => _AddDataState();
}

class _AddDataState extends State<AddData> {
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
    // check if date is valid or not
    if (DateTime.tryParse(date) == null) {
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Add Data"),
        ),
        body: ListView(
          children: [
            TextBox(dateController, "Date"),
            TextBox(typeController, "Type"),
            TextBox(durationController, "Duration"),
            TextBox(distanceController, "Distance"),
            TextBox(caloriesController, "Calories"),
            TextBox(rateController, "Rate"),
            ElevatedButton(
                onPressed: () {
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
                    Navigator.pop(
                        context,
                        FintessData(
                            date: date,
                            type: type,
                            duration: duration,
                            calories: calories,
                            distance: distance,
                            rate: rate));
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
                child: const Text("Save"))
          ],
        ));
  }
}
