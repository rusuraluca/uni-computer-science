import '../../models/record.dart';
import '../../repositories/records_repository.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class RecordsDatabaseRepository implements RecordsRepository {
  final Database _database;

  static const String tableName = 'Records';

  static const String idColumn = 'id';
  static const String titleColumn = 'title';
  static const String artistColumn = 'artist';
  static const String genreColumn = 'genre';
  static const String releaseYearColumn = 'releaseYear';
  static const String dateAcquiredColumn = 'dateAcquired';
  static const String coverColumn = 'cover';


  RecordsDatabaseRepository(this._database);

  static Future<RecordsRepository> init() async {
    var databasesPath = await getDatabasesPath();
    var path = join(databasesPath, 'records.db');

    //await deleteDatabase(path);

    // open the database
    var database = await openDatabase(path, version: 1,
        onCreate: (Database db, int version) async {
          // When creating the db, create the table
          await db.execute(
            '''
              CREATE TABLE $tableName(
              $idColumn INTEGER PRIMARY KEY AUTOINCREMENT,
              $titleColumn TEXT,
              $artistColumn TEXT,
              $genreColumn TEXT,
              $releaseYearColumn INTEGER,
              $dateAcquiredColumn TEXT,
              $coverColumn TEXT)
            '''
          );
        }
    );

    return RecordsDatabaseRepository(database);
  }

  @override
  Future<void> add(Record record) async {
    Map<String, dynamic> row = {
      titleColumn : record.title,
      artistColumn : record.artist,
      genreColumn: record.genre,
      releaseYearColumn: record.releaseYear,
      dateAcquiredColumn: record.dateAcquired,
      coverColumn: record.cover
    };

    await _database.insert(tableName, row);
  }

  @override
  Future<void> remove(int id) async {
    await _database.delete(tableName, where: "$idColumn = ?", whereArgs: [id]);
  }

  @override
  Future<void> update(int id, Record record) async {
    Map<String, dynamic> row = {
      titleColumn : record.title,
      artistColumn : record.artist,
      genreColumn: record.genre,
      releaseYearColumn: record.releaseYear,
      dateAcquiredColumn: record.dateAcquired,
      coverColumn: record.cover
    };

    await _database.update(tableName, row, where: "$idColumn = ?", whereArgs: [id]);
  }

  @override
  Future<List<Record>> getAll() async {
    List<Map<String, dynamic>> tasks = await _database.query(tableName);
    return tasks.map((e) => Record.fromMap(e)).toList();
  }
}