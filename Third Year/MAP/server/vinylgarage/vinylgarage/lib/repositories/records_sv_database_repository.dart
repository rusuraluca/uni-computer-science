// ignore_for_file: non_constant_identifier_names
import 'dart:async';
import 'dart:collection';
import 'dart:io';

import '../../models/record.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;

import '../utils/pair.dart';

class RecordsSVDatabaseRepository {
  final Database _database;
  final WebSocketChannel _channel;
  bool _online;
  bool get is_online => _online;
  List<Record> _records;
  late List<Record> _deleted_db_records;
  late List<Record> _updated_db_records;
  Function(bool)? onOnlineStatusChanged;
  late StreamSubscription _streamSubscription;
  Function(bool)? onDataUpdated;

  static const String tableName = 'Records';
  static const String idColumn = 'id';
  static const String titleColumn = 'title';
  static const String artistColumn = 'artist';
  static const String genreColumn = 'genre';
  static const String releaseYearColumn = 'releaseYear';
  static const String dateAcquiredColumn = 'dateAcquired';
  static const String coverColumn = 'cover';

  static const String ipAddress = '10.0.2.2';

  RecordsSVDatabaseRepository(this._database, this._channel, this._records, this._online) {
    _deleted_db_records = [];
    _updated_db_records = [];
    _initializeWebSocketListener();
    Timer.periodic(const Duration(seconds: 1), (Timer t) => checkOnline());
  }

  void _initializeWebSocketListener() {
    _streamSubscription = _channel.stream.listen(
      (data) {
        log("ws data $data");
        _listenToServerHandler(data);
      },
      onDone: _reconnect, // Attempt to reconnect on disconnection
      onError: (error) {
        log('ws error $error');
        _reconnect(); // Attempt to reconnect on error
      },
    );
  }

  void _reconnect() {
    print('ws attempting to reconnect...');
    _channel.sink.close();
    _streamSubscription.cancel();
    _initializeWebSocketListener();
  }

  static Future<RecordsSVDatabaseRepository> init() async {
    try {
      var databasesPath = await getDatabasesPath();
      var path = join(databasesPath, 'records.db');

      var database = await openDatabase(path, version: 1, onCreate: (Database db, int version) async {
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
      });
      final channel = WebSocketChannel.connect(Uri.parse("ws://$ipAddress:8765"));
      return RecordsSVDatabaseRepository(database, channel, [], false);
    } on Exception catch (e) {
      log('ERROR: $e');
      rethrow;
    }
  }

  Future<void> _listenToServerHandler(String data) async {
    var listData = data.split('\$');

    if (listData[0] == "ADD") {
      var recordJson = jsonDecode(listData[1]);
      File cover = File(recordJson['cover']);
      var record = Record(recordJson['title'], recordJson['artist'], recordJson['genre'], recordJson['releaseYear'], recordJson['dateAcquired'], cover);
      await _database.insert(tableName, record.toMap());
    } else if (listData[0] == "UPDATE") {
      var record = jsonDecode(listData[1]);
      File cover = File(record['cover']);
      await updateLocally(record['id'], record['title'], record['artist'], record['genre'], record['releaseYear'], record['dateAcquired'], cover);
    } else if (listData[0] == "DELETE") {
      await removeLocally(int.parse(listData[1]));
    }

    onDataUpdated?.call(true);
  }

  Future<void> _synchronizeServerAndClients() async {
    await checkOnline();

    if (_online) {
      var jsonArr = jsonEncode(_records);
      var deletedIds = jsonEncode(_deleted_db_records.map((record) => record.id).toList());
      var updatedRecords = jsonEncode(_updated_db_records.map((record) => record.toMapWithId()).toList());

      Map<String, String> headers = HashMap();
      headers['Accept'] = 'application/json';
      headers['Content-type'] = 'application/json';

      var response = await http.post(
        Uri.parse("http://$ipAddress:5001/record/sync"),
        headers: headers,
        body: jsonEncode({
          'records': jsonArr,
          'deleted_ids': deletedIds,
          'updated_records': updatedRecords,
        }),
        encoding: Encoding.getByName('utf-8')
      );

      if (response.statusCode == 200) {
        var res = json.decode(response.body);

        var recordsJson = res['records'] as List;
        _records = recordsJson.map((recordJson) => Record.fromJson(recordJson)).toList();

        await _database.execute("DELETE FROM $tableName");
        for (var record in _records) {
          await _database.insert(tableName, record.toMapWithId());
        }

        _deleted_db_records.clear();
        _updated_db_records.clear();
      }
    }
  }

  Future<bool> checkOnline() async {
    bool previousStatus = _online;
    try {
      var response = await http.get(Uri.parse("http://$ipAddress:5001/"))
                                .timeout(const Duration(seconds: 1));

      _online = response.statusCode == 200;
      if (_online && !previousStatus) {
        _initializeWebSocketListener();
        await _synchronizeServerAndClients();
      }
    } on Exception catch (e) {
      log('ERROR: $e');
      _online = false;
    }

    if (previousStatus != _online) {
        onOnlineStatusChanged?.call(_online);
    }

    log('Online status changed: $_online');
    return _online;
  }

  Future<Pair> getLocally() async {
    final List<Map<String, dynamic>> maps = await _database.query(tableName);

    _records.clear();

    for (var recordMap in maps) {
      var record = Record(recordMap['title'], recordMap['artist'], recordMap['genre'], recordMap['releaseYear'], recordMap['dateAcquired'], recordMap['cover'] == null ? null : File(recordMap['cover']));
      record.id = recordMap['id'] as int;
      _records.add(record);
    }

    return Pair(_records, _online);
  }

  Future<Pair> getAll() async {
    await checkOnline();
    try {
      var response = await http
          .get(Uri.parse("http://$ipAddress:5001/records"))
          .timeout(const Duration(seconds: 1));

      if (response.statusCode == 200) {
        var res = json.decode(response.body);
        var recordsJson = res['records'] as List;
        _records = recordsJson.map((recordJson) => Record.fromJson(recordJson)).toList();

        return Pair(_records, _online);
      } else {
        throw Exception('Failed to get records from server');
      }
    } on Exception catch (e) {
      log('ERROR: $e');
      return getLocally();
    }
  }

  Future<void> addLocally(String title, String artist, String genre, int releaseYear, String dateAcquired, File? cover) async {
    await _database.insert(tableName, Record(title, artist, genre, releaseYear, dateAcquired, cover).toMap());
  }

  Future<void> add(Record record) async {
    await checkOnline();
    if (_online) {
      try {
        Map<String, String> headers = HashMap();
        headers['Accept'] = 'application/json';
        headers['Content-type'] = 'application/json';

        var response = await http
              .post(Uri.parse("http://$ipAddress:5001/record"),
              headers: headers,
              body: jsonEncode({
                'title': record.title,
                'artist': record.artist,
                'genre': record.genre,
                'releaseYear': record.releaseYear,
                'dateAcquired': record.dateAcquired,
                'cover': record.cover != null ? record.cover?.path.toString() : ""
              }),
              encoding: Encoding.getByName('utf-8'))
              .timeout(const Duration(seconds: 1));

        if (response.statusCode == 200) {
          await addLocally(record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
          await _synchronizeServerAndClients();
          log('SUCCESS: Added record with title: ${record.title} artist: ${record.artist}');
        } else {
          throw Exception('Failed to add record to server');
        }
      } on Exception catch (e) {
        log('ERROR: $e');
        return addLocally(record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
      }
    } else {
        return addLocally(record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
    }
  }

  Future<void> removeLocally(int id) async {
    _records.removeWhere((element) => element.id == id);
    await _database.delete(tableName, where: ' id = ?', whereArgs: [id]);
  }

  Future<void> remove(int id) async {
    await checkOnline();
    if (_online) {
      try {
        var response = await http
          .delete(Uri.parse("http://$ipAddress:5001/record/$id"))
          .timeout(const Duration(seconds: 1));

        if (response.statusCode == 200) {
          _deleted_db_records.add(_records.firstWhere((element) => element.id == id));
          await removeLocally(id);
          await _synchronizeServerAndClients();
          log('SUCCESS: Removed record with id $id');
        } else {
          throw Exception('Failed to remove record from server');
        }
      } on Exception catch (e) {
        log('ERROR: $e');
        _deleted_db_records.add(_records.firstWhere((element) => element.id == id));
        await removeLocally(id);
      }
    } else {
      _deleted_db_records.add(_records.firstWhere((element) => element.id == id));

      await removeLocally(id);
    }
  }


  Future<void> updateLocally(int id, String title, String artist, String genre, int releaseYear, String dateAcquired, File? cover) async {
    await _database.update(tableName, Record(title, artist, genre, releaseYear, dateAcquired, cover).toMap(), where: "$idColumn = ?", whereArgs: [id]);
  }


  Future<void> update(int id, Record record) async {
    await checkOnline();
    var record_w_id = Record(record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
    record_w_id.id = id;
    if (_online) {
      try {
        Map<String, String> headers = HashMap();
        headers['Accept'] = 'application/json';
        headers['Content-type'] = 'application/json';

        var response = await http
                            .put(Uri.parse("http://$ipAddress:5001/record"),
                            headers: headers,
                            body: jsonEncode({
                              'id': id,
                              'title': record.title,
                              'artist': record.artist,
                              'genre': record.genre,
                              'releaseYear': record.releaseYear,
                              'dateAcquired': record.dateAcquired,
                              'cover': record.cover != null ? record.cover?.path.toString() : ""
                            }),
                            encoding: Encoding.getByName('utf-8'))
                            .timeout(const Duration(seconds: 1));
        if (response.statusCode == 200) {
          _updated_db_records.add(record_w_id);
          await updateLocally(id, record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
          await _synchronizeServerAndClients();
          log('SUCCESS: Updated record with id $id');
        } else {
          throw Exception('Failed to update record to server');
        }
      } on Exception catch (e) {
        log('ERROR: $e');
        _updated_db_records.add(record_w_id);
        return updateLocally(id, record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
      }
    } else {
        _updated_db_records.add(record_w_id);
        await updateLocally(id, record.title, record.artist, record.genre, record.releaseYear, record.dateAcquired, record.cover);
    }
  }
}