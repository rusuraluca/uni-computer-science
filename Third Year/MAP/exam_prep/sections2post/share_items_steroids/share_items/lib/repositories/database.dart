import '../models/item.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseRepository {
  static const int _version = 1;
  static const String _name = 'app5.db';
  static Logger logger = Logger();

  Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE items(
          id INTEGER PRIMARY KEY,
          name TEXT, description TEXT,
          image TEXT,
          category TEXT,
          units INTEGER,
          price REAL
          )
      ''');
      await db.execute('''
        CREATE TABLE categories (
          id INTEGER PRIMARY KEY,
          category TEXT NOT NULL
        )
      ''');
    });
  }

  Future<List<String>> getAttributes() async {
    final db = await _getDB();
    final result = await db.query('categories');
    logger.log(Level.info, "getAttributes() result: $result");
    return result.map((e) => e['category'].toString()).toList();
  }

  Future<List<Item>> getItemsByAttribute(String attribute) async {
    final db = await _getDB();
    final result = await db.query('items', where: 'category = ?', whereArgs: [attribute]);
    logger.log(Level.info, "getItemsByAttribute() result: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  Future<Item> addItem(Item item) async {
    final db = await _getDB();
    final id = await db.insert('items', item.toJsonWithoutId(), conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addItem() id: $id");
    return item.copy(id: id);
  }

  Future<int> deleteItem(int id) async {
    final db = await _getDB();
    final result = await db.delete('items', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deleteItem() result: $result");
    return result;
  }

  Future<void> updateItems(List<Item> items) async {
    var db = await _getDB();
    await db.delete('items');
    for (var item in items) {
      await db.insert('items', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItems() result: $items");
  }

  Future<void> updateAttributes(List<String> attributes) async {
    var db = await _getDB();
    await db.delete('categories');
    for (var attribute in attributes) {
      await db.insert('categories', {'category': attribute});
    }
    logger.log(Level.info, "updateAttributes() result: $attributes");
  }

  Future<void> updateItemsByAttribute(String attribute, List<Item> items) async {
    final db = await _getDB();
    await db.delete('items', where: 'category = ?', whereArgs: [attribute]);
    for (var item in items) {
      await db.insert('items', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItemsByAttribute()result: $items");
  }

  Future<int> updatePrice(int id, double price) async {
    final db = await _getDB();
    final result = await db.update('items', {'price': price}, where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "updatePrice: $result");
    return result;
  }

  Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
