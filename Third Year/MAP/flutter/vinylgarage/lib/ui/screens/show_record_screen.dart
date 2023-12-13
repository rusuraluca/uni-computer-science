import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/record.dart';
import '../../providers/record_provider.dart';
import 'package:provider/provider.dart';
import 'edit_record_screen.dart';

class ShowRecordScreen extends StatelessWidget {
  final Record record;

  const ShowRecordScreen({Key? key, required this.record}) : super(key: key);

  Widget buildRow(String label, String value) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.normal),
              ),
            ],
          ),
        ),
        const SizedBox(width: 20),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String formatDateTime(String value) {
    final DateTime dateTime = DateTime.parse(value);
    final String formattedDate = DateFormat('d MMMM y').format(dateTime);
    return formattedDate;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<RecordProvider>(
        builder: ((context, provider, child) => Scaffold(
              appBar: AppBar(
                backgroundColor: Colors.white,
                iconTheme: const IconThemeData(
                    color: Colors.black),
                actions: [
                  InkWell(
                      onTap: () {
                        provider.titleController.text = record.title;
                        provider.artistController.text =
                            record.artist.toString();
                        provider.genreController.text = record.genre.toString();
                        provider.releaseYearController.text =
                            record.releaseYear.toString();
                        provider.dateAcquiredController.text = record
                            .dateAcquired
                            .toLocal()
                            .toString()
                            .split(' ')[0];
                        provider.cover = record.cover;
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: ((context) =>
                                    EditRecordScreen(record: record))));
                      },
                      child: const Icon(Icons.edit, color: Colors.orange)),
                  const SizedBox(width: 20),
                  InkWell(
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: const Text("Confirm Deletion"),
                            content: const Text(
                                "Are you sure you want to delete this vinyl record?"),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.of(context)
                                      .pop();
                                },
                                child: const Text("Cancel"),
                              ),
                              TextButton(
                                onPressed: () {
                                  provider.deleteRecord(record);
                                  Navigator.pop(context);
                                  Navigator.of(context).pop();
                                },
                                child: const Text("Delete",
                                    style: TextStyle(color: Colors.red)),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    child: const Icon(Icons.delete, color: Colors.red),
                  ),
                  const SizedBox(width: 20),
                ],
              ),
              body: SingleChildScrollView(
                  child: Column(children: [
                Container(
                  margin: const EdgeInsets.all(10),
                  decoration:
                      BoxDecoration(borderRadius: BorderRadius.circular(5)),
                  height: 250,
                  child: Align(
                    alignment: Alignment.center,
                    child: Container(
                      child: record.cover == null
                          ? const Center(
                              child: CircleAvatar(
                              radius: 40,
                              backgroundImage: AssetImage(
                                  'assets/images/record_default.png'),
                            ))
                          : Image.file(
                              record.cover!,
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  margin: const EdgeInsets.all(30),
                  decoration:
                      BoxDecoration(borderRadius: BorderRadius.circular(5)),
                  height: 170,
                  width: double.infinity,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      buildRow("Title: ", record.title),
                      buildRow("Artist: ", record.artist),
                      buildRow("Genre: ", record.genre),
                      buildRow("Release Year: ", record.releaseYear.toString()),
                      buildRow(
                          "Date Acquired: ",
                          formatDateTime(record.dateAcquired
                              .toLocal()
                              .toString()
                              .split(' ')[0])),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ])),
            )));
  }
}
