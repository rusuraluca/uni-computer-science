import 'package:finance_tracker/models/item.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static const int _version = 1;
  static const String _name = 'finance.db';
  static Logger logger = Logger();

  static Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE finance_data (
          id INTEGER PRIMARY KEY,
          date TEXT NOT NULL,
          type TEXT NOT NULL,
          amount DOUBLE NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL
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

  // get all days
  static Future<List<String>> getDates() async {
    final db = await _getDB();
    final result = await db.query('dates');
    logger.log(Level.info, "getDates() result: $result");
    return result.map((e) => e['date'] as String).toList();
  }

  // get all finance data by date
  static Future<List<FinanceData>> getFinanceDataByDate(String date) async {
    final db = await _getDB();
    final result =
        await db.query('finance_data', where: 'date = ?', whereArgs: [date]);
    logger.log(Level.info, "getFitnessDataByDate() result: $result");
    return result.map((e) => FinanceData.fromJson(e)).toList();
  }

  // add finance data
  static Future<FinanceData> addFinanceData(FinanceData financeData) async {
    final db = await _getDB();
    final id = await db.insert('finance_data', financeData.toJsonWithoutId(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addFinanceData() id: $id");
    return financeData.copy(id: id);
  }

  // delete finance data
  static Future<int> deleteFinanceData(int id) async {
    final db = await _getDB();
    final result =
        await db.delete('finance_data', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deleteFinanceData() result: $result");
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

  // update finance data for date
  static Future<void> updateFinanceDataForDate(
    String date, List<FinanceData> financeData) async {
    final db = await _getDB();
    await db.delete('finance_data', where: 'date = ?', whereArgs: [date]);
    for (var data in financeData) {
      await db.insert('finance_data', data.toJsonWithoutId());
    }
    logger.log(
        Level.info, "updateFinanceDataForDate() financeData: $financeData");
  }

  // close database
  static Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
