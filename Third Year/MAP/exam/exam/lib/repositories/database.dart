import '../models/item.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseRepository {
  static const int _version = 1;
  static const String _name = 'exam5.db';
  static Logger logger = Logger();

  Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE items(
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          organizer TEXT NOT NULL,
          category TEXT NOT NULL,
          capacity INTEGER NOT NULL,
          registered INTEGER NOT NULL
          )
      ''');
      await db.execute('''
        CREATE TABLE reserved_items(
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          organizer TEXT NOT NULL,
          category TEXT NOT NULL,
          capacity INTEGER NOT NULL,
          registered INTEGER NOT NULL
          )
      ''');
    });
  }

  Future<List<Item>> getItems() async {
    final db = await _getDB();
    final result = await db.query('items');
    logger.log(Level.info, "getAttributes() result: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  Future<List<Item>> getAttributes() async {
    final db = await _getDB();
    final result = await db.query('reserved_items');
    logger.log(Level.info, "getAttributes() result: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  Future<Item> addItem(Item item) async {
    final db = await _getDB();
    final id = await db.insert('items', item.toJsonWithoutId(), conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addItem() id: $id");
    return item.copy(id: id);
  }

  Future<void> updateItems(List<Item> items) async {
    var db = await _getDB();
    await db.delete('items');
    for (var item in items) {
      await db.insert('items', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItems() result: $items");
  }

  Future<void> updateAttributes(List<Item> items) async {
    var db = await _getDB();
    await db.delete('reserved_items');
    db = await _getDB();
    for (var item in items) {
      await db.insert('reserved_items', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItems() result: $items");
  }

  Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
