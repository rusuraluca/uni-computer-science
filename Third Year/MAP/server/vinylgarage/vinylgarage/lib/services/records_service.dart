// ignore_for_file: non_constant_identifier_names

import 'package:flutter/material.dart';
import '../models/record.dart';
import '../../repositories/records_sv_database_repository.dart';
import '../utils/pair.dart';
import 'dart:io';

class RecordsService extends ChangeNotifier {
  final RecordsSVDatabaseRepository _repository;

  RecordsService(this._repository){
    _repository.onOnlineStatusChanged = (is_online) {
      notifyListeners();
    };
    _repository.onDataUpdated = (is_updated) {
      notifyListeners();
    };
  }

  bool get is_online => _repository.is_online;

  static Future<RecordsService> init() async {
    var repository = await RecordsSVDatabaseRepository.init();
    return RecordsService(repository);
  }

  void add(String title, String artist, String genre, int releaseYear, String dateAcquired, File? cover) {
    _repository.add(Record(title, artist, genre, releaseYear, dateAcquired, cover)).then((_) {
      notifyListeners();
    });
  }

  void remove(int id) {
    _repository.remove(id).then((_) {
      notifyListeners();
    });
  }

  void update(int id, String title, String artist, String genre, int releaseYear, String dateAcquired, File? cover) {
    _repository.update(id, Record(title, artist, genre, releaseYear, dateAcquired, cover)).then((_) {
      notifyListeners();
    });
  }

  Future<Pair> getAllRecords() async {
    return await _repository.getAll();
  }
}