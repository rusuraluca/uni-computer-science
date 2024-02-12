import 'package:flutter/material.dart';
import 'package:share_items/models/item.dart';
import 'package:share_items/widgets/message.dart';
import 'package:share_items/widgets/text_box.dart';

class AddItem extends StatefulWidget {
  const AddItem({super.key});

  @override
  State<StatefulWidget> createState() => _AddItemState();
}

class _AddItemState extends State<AddItem> {
  late TextEditingController nameController;
  late TextEditingController descriptionController;
  late TextEditingController imageController;
  late TextEditingController categoryController;
  late TextEditingController unitsController;
  late TextEditingController priceController;

  @override
  void initState() {
    nameController = TextEditingController();
    descriptionController = TextEditingController();
    imageController = TextEditingController();
    categoryController = TextEditingController();
    unitsController = TextEditingController();
    priceController = TextEditingController();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Item'),
      ),
      body: ListView(
        children: [
          TextBox(nameController, 'Name'),
          TextBox(descriptionController, 'Description'),
          TextBox(imageController, 'Image'),
          TextBox(categoryController, 'Category'),
          TextBox(unitsController, 'Units'),
          TextBox(priceController, 'Price'),
          ElevatedButton(
              onPressed: () {
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
                  Navigator.pop(
                      context,
                      Item(
                          name: name,
                          description: description,
                          image: image,
                          category: category,
                          units: units,
                          price: price));
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
              child: const Text('Save'))
        ],
      ),
    );
  }
}
