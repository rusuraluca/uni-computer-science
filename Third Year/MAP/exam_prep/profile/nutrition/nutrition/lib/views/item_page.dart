// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/item.dart';
import '../services/data.dart';
import '../widgets/message.dart';

class ItemPage extends StatelessWidget {
  final String _type;

  const ItemPage(this._type, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final dataService = Provider.of<DataService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_type),
      ),
      body: FutureBuilder<List<Item>>(
        future: dataService.getItemsByAttribute(_type),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No data available.'));
          } else {
            final items = snapshot.data!;

            return Padding(
              padding: const EdgeInsets.all(25),
              child: ListView.builder(
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  return ListTile(
                    title: Text(item.name),
                    subtitle: Text(
                      'Type: ${item.type}, Calories: ${item.calories}, Date: ${item.date}, Notes: ${item.notes}',
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () {
                        deleteItem(context, dataService, item);
                      },
                      color: Colors.red,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18.0),
                      side: const BorderSide(
                        color: Colors.grey,
                        width: 1.0,
                      ),
                    ),
                  );
                },
              ),
            );
          }
        },
      ),
    );
  }

  void deleteItem(BuildContext context, DataService dataService, Item item) async {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Delete Data"),
          content: const Text("Are you sure you want to delete this data?"),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text("Cancel"),
            ),
            TextButton(
              onPressed: () async {
                Navigator.of(context).pop();
                try {
                  if (dataService.online) {
                    await dataService.deleteItem(item.id!);
                  } else {
                    message(context, "Operation not available offline", "Info");
                  }
                } catch (e) {
                  message(context, "Error when deleting data", "Error");
                }
              },
              child: const Text("Delete", style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }
}
