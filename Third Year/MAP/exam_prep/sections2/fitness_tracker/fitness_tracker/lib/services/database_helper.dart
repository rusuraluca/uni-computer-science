import 'package:fitness_tracker/models/fitness_data.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static const int _version = 1;
  static const String _name = 'fitness.db';
  static Logger logger = Logger();

  static Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE fitness_data (
          id INTEGER PRIMARY KEY,
          date TEXT NOT NULL,
          type TEXT NOT NULL,
          duration INTEGER NOT NULL,
          distance INTEGER,
          calories INTEGER NOT NULL,
          rate INTEGER
        )
      ''');
      await db.execute('''
        CREATE TABLE dates (
          id INTEGER PRIMARY KEY,
          date TEXT NOT NULL
        )
      ''');
    });
  }

  // get all dates
  static Future<List<String>> getDates() async {
    final db = await _getDB();
    final result = await db.query('dates');
    logger.log(Level.info, "getDates() result: $result");
    return result.map((e) => e['date'] as String).toList();
  }

  // get all fitness data by date
  static Future<List<FintessData>> getFitnessDataByDate(String date) async {
    final db = await _getDB();
    final result =
        await db.query('fitness_data', where: 'date = ?', whereArgs: [date]);
    logger.log(Level.info, "getFitnessDataByDate() result: $result");
    return result.map((e) => FintessData.fromJson(e)).toList();
  }

  // add fitness data
  static Future<FintessData> addFitnessData(FintessData fitnessData) async {
    final db = await _getDB();
    final id = await db.insert('fitness_data', fitnessData.toJsonWithoutId(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addFitnessData() id: $id");
    return fitnessData.copy(id: id);
  }

  // delete fitness data
  static Future<int> deleteFitnessData(int id) async {
    final db = await _getDB();
    final result =
        await db.delete('fitness_data', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deleteFitnessData() result: $result");
    return result;
  }

  //update dates in database
  static Future<void> updateDates(List<String> dates) async {
    final db = await _getDB();
    await db.delete('dates');
    for (var date in dates) {
      await db.insert('dates', {'date': date});
    }
    logger.log(Level.info, "updateDates() dates: $dates");
  }

  // update fintess data for date
  static Future<void> updateFitnessDataForDate(
    String date, List<FintessData> fitnessData) async {
    final db = await _getDB();
    await db.delete('fitness_data', where: 'date = ?', whereArgs: [date]);
    for (var data in fitnessData) {
      await db.insert('fitness_data', data.toJsonWithoutId());
    }
    logger.log(
        Level.info, "updateFitnessDataForDate() fitnessData: $fitnessData");
  }

  // close database
  static Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
