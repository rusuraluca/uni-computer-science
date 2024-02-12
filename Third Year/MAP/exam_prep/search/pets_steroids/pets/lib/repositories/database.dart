import '../models/item.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseRepository {
  static const int _version = 1;
  static const String _name = 'app2.db';
  static Logger logger = Logger();

  Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE pets (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          breed TEXT NOT NULL,
          age INTEGER NOT NULL,
          weight INTEGER NOT NULL,
          owner TEXT NOT NULL,
          location TEXT NOT NULL,
          description TEXT NOT NULL
        )
      ''');
      await db.execute('''
        CREATE TABLE names (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        )
      ''');
    });
  }

  Future<List<List<dynamic>>> getAttributes() async {
    final db = await _getDB();
    final result = await db.query('names');
    logger.log(Level.info, "getAttributes() result: $result");
    return result.map((e) => [e['id'], e['name']]).toList();
  }

  Future<List<Item>> getItemsByAttribute(int attribute) async {
    final db = await _getDB();
    final result = await db.query('pets', where: 'id = ?', whereArgs: [attribute]);
    logger.log(Level.info, "getItemsByAttribute() result: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  Future<Item> addItem(Item item) async {
    final db = await _getDB();
    final exists = await db.query('pets', where: 'name = ? AND breed = ?', whereArgs: [item.name, item.breed]);
    if (exists.isNotEmpty) {
      throw Exception('Item already exists');
    }
    final id = await db.insert('pets', item.toJsonWithoutId(), conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addItem() id: $id");
    return item.copy(id: id);
  }

  Future<int> deleteItem(int id) async {
    final db = await _getDB();
    final result = await db.delete('pets', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deleteItem() result: $result");
    return result;
  }

  Future<void> updateItems(List<Item> items) async {
    var db = await _getDB();
    await db.delete('pets');
    db = await _getDB();
    for (var item in items) {
      await db.insert('pets', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItems() result: $items");
  }

  Future<void> updateAttributes(List<dynamic> attributes) async {
    var db = await _getDB();
    await db.delete('names');
    for (var attribute in attributes) {
      final row = {
        'id': attribute[0],
        'name': attribute[1],
      };
      await db.insert('names', row);
    }
    logger.log(Level.info, "updateAttributes() result: $attributes");
  }

  Future<void> updateItemsByAttribute(int attribute, List<Item> items) async {
    var db = await _getDB();
    await db.delete('pets', where: 'id = ?', whereArgs: [attribute]);
    for (var item in items) {
      await db.insert('pets', item.toJsonWithoutId());
    }
    logger.log(Level.info, "updateItemsByAttribute() result: $items");
  }

  Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
