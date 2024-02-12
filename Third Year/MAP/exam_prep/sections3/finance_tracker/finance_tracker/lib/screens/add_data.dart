import 'package:finance_tracker/models/item.dart';
import 'package:finance_tracker/widgets/text_box.dart';
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
  late TextEditingController amountController;
  late TextEditingController categoryController;
  late TextEditingController descriptionController;

  @override
  void initState() {
    super.initState();
    dateController = TextEditingController();
    typeController = TextEditingController();
    amountController = TextEditingController();
    categoryController = TextEditingController();
    descriptionController = TextEditingController();
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
            TextBox(amountController, "Amount"),
            TextBox(categoryController, "Category"),
            TextBox(descriptionController, "Description"),
            ElevatedButton(
                onPressed: () {
                  String date = dateController.text;
                  String type = typeController.text;
                  double? amount = double.tryParse(amountController.text);
                  String category = categoryController.text;
                  String description = descriptionController.text;
                  if (isDateValid(date) &&
                      type.isNotEmpty &&
                      amount != null &&
                      category.isNotEmpty &&
                      description.isNotEmpty) {
                    Navigator.pop(
                        context,
                        FinanceData(
                            date: date,
                            type: type,
                            amount: amount,
                            category: category,
                            description: description));
                  } else {
                    if (!isDateValid(date)) {
                      message(context, "Date is not valid", "Error");
                    } else if (type.isEmpty) {
                      message(context, "Type is empty", "Error");
                    } else if (amount == null) {
                      message(context, "Amount is not valid", "Error");
                    } else if (category.isEmpty) {
                      message(context, "Category is empty", "Error");
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
