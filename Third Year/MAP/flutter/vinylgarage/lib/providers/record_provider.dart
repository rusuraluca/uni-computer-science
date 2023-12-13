import 'dart:io';
import 'package:flutter/material.dart';
import '../data_repository/db_helper.dart';
import '../models/record.dart';

class RecordProvider extends ChangeNotifier {
  RecordProvider() {
    initDatabase();
  }

  late TextEditingController titleController = TextEditingController();
  late TextEditingController artistController = TextEditingController();
  late TextEditingController genreController = TextEditingController();
  late TextEditingController releaseYearController = TextEditingController();
  late TextEditingController dateAcquiredController = TextEditingController();
  File? cover;

  List<Record> allRecords = [];

  Future<void> initDatabase() async {
    await DBhelper.dbHelper.initDatabase();
    getRecords();
  }

  getRecords() async {
    allRecords = await DBhelper.dbHelper.getAllRecords();
    notifyListeners();
  }

  insertNewRecord() async {
    Record record = Record(
      title: titleController.text,
      artist: artistController.text,
      genre: genreController.text,
      releaseYear: int.parse(releaseYearController.text),
      dateAcquired: DateTime.parse(dateAcquiredController.text),
      cover: cover,
    );
    await DBhelper.dbHelper.insertNewRecord(record);
    allRecords.add(record);
    notifyListeners();
  }

  updateRecord(Record record) async {
    await DBhelper.dbHelper.updateRecord(record);
    var index = allRecords.indexWhere((e) => e.id == record.id);
    if (index != -1) {
      allRecords[index] = record;
      notifyListeners();
    }
  }

  deleteRecord(Record record) async {
    await DBhelper.dbHelper.deleteRecord(record);
    allRecords.removeWhere((e) => e.id == record.id);
    notifyListeners();
  }

  void disposeControllers() {
    titleController.dispose();
    artistController.dispose();
    genreController.dispose();
    releaseYearController.dispose();
    dateAcquiredController.dispose();
  }

  @override
  void dispose() {
    disposeControllers();
    super.dispose();
  }
}
