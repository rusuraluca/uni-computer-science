import 'dart:io';

import '../models/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DBhelper {
  late Database database;
  static DBhelper dbHelper = DBhelper();
  final String tableName = 'records';
  final String idColumn = 'id';
  final String titleColumn = 'title';
  final String artistColumn = 'artist';
  final String genreColumn = 'genre';
  final String releaseYearColumn = 'releaseYear';
  final String dateAcquiredColumn = 'dateAcquired';
  final String coverColumn = 'cover';

  Future<Database> connectToDatabase() async {
    Directory directory = await getApplicationDocumentsDirectory();

    String path = '$directory/vinylgarage.db';

    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version){
        db.execute(
          ''' CREATE TABLE $tableName(
              $idColumn INTEGER PRIMARY KEY AUTOINCREMENT,
              $titleColumn TEXT,
              $artistColumn TEXT,
              $genreColumn TEXT,
              $releaseYearColumn INTEGER,
              $dateAcquiredColumn TEXT,
              $coverColumn TEXT)'''
        );
      },
      onUpgrade: (db, oldVersion, newVersion){
        db.execute(
          ''' CREATE TABLE $tableName(
              $idColumn INTEGER PRIMARY KEY AUTOINCREMENT,
              $titleColumn TEXT,
              $artistColumn TEXT,
              $genreColumn TEXT,
              $releaseYearColumn INTEGER,
              $dateAcquiredColumn TEXT,
              $coverColumn TEXT)'''
        );
      },
      onDowngrade: (db, oldVersion, newVersion){
        db.delete(tableName);
      },
    );
  }

  initDatabase() async {
      database = await connectToDatabase();
  }

  Future <List<Record>> getAllRecords() async {
    List<Map<String, dynamic>> tasks = await database.query(tableName);
    return tasks.map((e) => Record.fromMap(e)).toList();
  }

  insertNewRecord(Record record) async {
    await database.insert(tableName, record.toMap());
  }

  updateRecord(Record record) async {
    await database.update(
      tableName,
      {
        titleColumn: record.title,
        artistColumn: record.artist,
        genreColumn: record.genre,
        releaseYearColumn: record.releaseYear,
        dateAcquiredColumn: record.dateAcquired.toIso8601String(),
        coverColumn: record.cover == null ? null : record.cover!.path
      },
      where: '$idColumn = ?',
      whereArgs: [record.id]);
  }

  deleteRecord(Record record) async {
    await database.delete(tableName, where: '$idColumn = ?', whereArgs: [record.id]);
  }

  deleteVinylGarage() async {
    await database.delete(tableName);
  }
}

