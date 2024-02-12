import '../models/item.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseRepository {
  static const int _version = 1;
  static const String _name = 'app3.db';
  static Logger logger = Logger();

  Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE entries (
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

  Future<List<Item>> getItems() async {
    final db = await _getDB();
    final result = await db.query('entries');
    logger.log(Level.info, "getItems() result: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  Future<List<String>> getAttributes() async {
    final db = await _getDB();
    final result = await db.query('dates');
    logger.log(Level.info, "getAttributes() result: $result");
    return result.map((e) => e['date'].toString()).toList();
  }

  Future<List<Item>> getItemsByAttribute(String attribute) async {
    final db = await _getDB();
    final result = await db.query('entries', where: 'date = ?', whereArgs: [attribute]);
    logger.log(Level.info, "getItemsByAttribute() result: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  Future<Item> addItem(Item item) async {
    final db = await _getDB();
    final exists = await db.query('entries', where: 'date = ? AND type = ?', whereArgs: [item.date, item.type]);
    if (exists.isNotEmpty) {
      throw Exception('Item already exists');
    }
    final id = await db.insert('entries', item.toJsonWithoutId(), conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addItem() id: $id");
    return item.copy(id: id);
  }

  Future<int> deleteItem(int id) async {
    final db = await _getDB();
    final result = await db.delete('entries', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deleteItem() result: $result");
    return result;
  }

  Future<void> updateItems(List<Item> items) async {
    var db = await _getDB();
    await db.delete('entries');
    for (var item in items) {
      await db.insert('entries', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItems() result: $items");
  }

  Future<void> updateAttributes(List<String> attributes) async {
    var db = await _getDB();
    await db.delete('dates');
    for (var attribute in attributes) {
      await db.insert('dates', {'date': attribute});
    }
    logger.log(Level.info, "updateAttributes() result: $attributes");
  }

  Future<void> updateItemsByAttribute(String attribute, List<Item> items) async {
    final db = await _getDB();
    await db.delete('entries', where: 'type = ?', whereArgs: [attribute]);
    for (var item in items) {
      await db.insert('entries', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItemsByAttribute()result: $items");
  }

  Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
