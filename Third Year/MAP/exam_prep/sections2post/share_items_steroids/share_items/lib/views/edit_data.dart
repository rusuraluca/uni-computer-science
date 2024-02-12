import 'package:flutter/material.dart';
import 'package:share_items/widgets/message.dart';

import '../models/item.dart';

class EditData extends StatefulWidget {
  final Item item;

  const EditData({Key? key, required this.item}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _EditDataState();
}

class _EditDataState extends State<EditData> {
  late TextEditingController priceController;

  @override
  void initState() {
    priceController = TextEditingController(text: widget.item.price.toString());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Price'),
      ),
      body: ListView(
        children: [
          Text('Name: ${widget.item.name}'),
          Text('Description: ${widget.item.description}'),
          Text('Image: ${widget.item.image}'),
          Text('Category: ${widget.item.category}'),
          Text('Units: ${widget.item.units.toString()}'),
          TextField(
            controller: priceController,
            decoration: const InputDecoration(
              labelText: 'Price',
            ),
          ),
          ElevatedButton(
              onPressed: () {
                double? price = double.tryParse(priceController.text);
                if (price != null) {
                  Navigator.pop(
                      context,
                      Item(
                        id: widget.item.id,
                        name: widget.item.name,
                        description: widget.item.description,
                        image: widget.item.image,
                        category: widget.item.category,
                        units: widget.item.units,
                        price: price.toDouble(),
                      ));
                } else {
                  message(context, "Price must be a double", "Error");
                }
              },
              child: const Text('Save')),
        ],
      ),
    );
  }
}
