import 'package:logger/logger.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

import '../models/item.dart';

class DatabaseHelper {
  static const int _version = 1;
  static const String _databaseName = 'shareitems.db';
  static Logger logger = Logger();

  static Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _databaseName);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute(
          'CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT, description TEXT, image TEXT, category TEXT, units INTEGER, price REAL)');
      await db.execute(
          'CREATE TABLE categories(id INTEGER PRIMARY KEY, name TEXT)');
    });
  }

  // get all items
  static Future<List<Item>> getItems() async {
    final db = await _getDB();
    final result = await db.query('items');
    logger.log(Level.info, "getItems: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  // get all categories
  static Future<List<String>> getCategories() async {
    final db = await _getDB();
    final result = await db.query('categories');
    logger.log(Level.info, "getCategories: $result");
    return result.map((e) => e['name'].toString()).toList();
  }

  // get items by category
  static Future<List<Item>> getItemsByCategory(String category) async {
    final db = await _getDB();
    final result =
        await db.query('items', where: 'category = ?', whereArgs: [category]);
    logger.log(Level.info, "getItemsByCategory: $result");
    return result.map((e) => Item.fromJson(e)).toList();
  }

  // delete item
  static Future<int> deleteItem(int id) async {
    final db = await _getDB();
    final result = await db.delete('items', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deleteItem: $result");
    return result;
  }

  // add item
  static Future<Item> addItem(Item item) async {
    final db = await _getDB();
    final id = await db.insert('items', item.toJsonWithoutId(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addItem: $id");
    return item.copy(id: id);
  }

  // update price if an item
  static Future<int> updatePrice(int id, double price) async {
    final db = await _getDB();
    final result = await db.update('items', {'price': price},
        where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "updatePrice: $result");
    return result;
  }

  // update categories in database
  static Future<void> updateCategories(List<String> categories) async {
    final db = await _getDB();
    await db.delete('categories');
    for (var i = 0; i < categories.length; i++) {
      await db.insert('categories', {'name': categories[i]});
    }
    logger.log(Level.info, "updateCategories: $categories");
  }

  // update a category's items
  static Future<void> updateCategoryItems(
      String category, List<Item> items) async {
    final db = await _getDB();
    await db.delete('items', where: 'category = ?', whereArgs: [category]);
    for (var i = 0; i < items.length; i++) {
      await db.insert('items', items[i].toJsonWithoutId());
    }
    logger.log(Level.info, "updateCategoryItems: $category, $items");
  }

  // close database
  static Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
