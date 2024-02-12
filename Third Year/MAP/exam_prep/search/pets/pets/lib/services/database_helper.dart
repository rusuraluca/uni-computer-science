import '../models/item.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static const int _version = 1;
  static const String _name = 'pets.db';
  static Logger logger = Logger();

  static Future<Database> _getDB() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = join(directory.path, _name);
    return await openDatabase(path, version: _version,
        onCreate: (db, version) async {
      await db.execute('''
        CREATE TABLE pets (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          breed TEXT NOT NULL,
          age INT NOT NULL,
          weight INT NOT NULL,
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

  // get all pets
  static Future<List<List<dynamic>>> getPets() async {
    final db = await _getDB();
    final result = await db.query('names');
    logger.log(Level.info, "getPets() result: $result");
    return result.map((e) => [e['id'], e['name']]).toList();
  }


  // get all pets data by id
  static Future<List<Pet>> getPetsById(int id) async {
    final db = await _getDB();
    final result =
        await db.query('pets', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "getPetsById() result: $result");
    return result.map((e) => Pet.fromJson(e)).toList();
  }

  // add pet data
  static Future<Pet> addPet(Pet pet) async {
    final db = await _getDB();
    final id = await db.insert('pets', pet.toJsonWithoutId(),
        conflictAlgorithm: ConflictAlgorithm.replace);
    logger.log(Level.info, "addPet() id: $id");
    return pet.copy(id: id);
  }

  // delete pet data
  static Future<int> deletePet(int id) async {
    final db = await _getDB();
    final result =
        await db.delete('pets', where: 'id = ?', whereArgs: [id]);
    await db.delete('names', where: 'id = ?', whereArgs: [id]);
    logger.log(Level.info, "deletePet() result: $result");
    return result;
  }

  //update pets in database
  static Future<void> updatePets(List<List<dynamic>> pets) async {
    final db = await _getDB();
    await db.delete('names');
    for (var pet in pets) {
      final row = {
        'id': pet[0],
        'name': pet[1],
      };
      await db.insert('names', row);
    }
    logger.log(Level.info, "updatePets() pets: $pets");
  }

  // update pet data for name
  static Future<void> updatePetForId(int id, List<Pet> pet) async {
    final db = await _getDB();
    await db.delete('pets', where: 'id = ?', whereArgs: [id]);
    for (var data in pet) {
      await db.insert('pets', data.toJson());
    }
    logger.log(
        Level.info, "updatePetForId() pet: $pet)");
  }

  // close database
  static Future<void> close() async {
    final db = await _getDB();
    await db.close();
  }
}
