import 'dart:io';

class Record {
  late int id;
  String title;
  String artist;
  String genre;
  int releaseYear;
  String dateAcquired;
  File? cover;

  Record(this.title, this.artist, this.genre, this.releaseYear, this.dateAcquired, this.cover){
    id = -1;
  }

  Map<String, dynamic> toMapWithId() {
    return {
      'id': id,
      'title': title,
      'artist': artist,
      'genre': genre,
      'releaseYear': releaseYear,
      'dateAcquired': dateAcquired,
      'cover': cover?.path,
    };
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'artist': artist,
      'genre': genre,
      'releaseYear': releaseYear,
      'dateAcquired': dateAcquired,
      'cover': cover != null ? cover?.path : "",
    };
  }

  factory Record.fromMap(Map<String, dynamic> map) {
    var record = Record(map['title'], map['artist'], map['genre'], map['releaseYear'], map['dateAcquired'], map['cover'] == null ? null : File(map['cover']));
    record.id = map['id'];
    return record;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'artist': artist,
      'genre': genre,
      'releaseYear': releaseYear,
      'dateAcquired': dateAcquired,
      'cover': cover != null ? cover?.path : "",
    };
  }

  factory Record.fromJson(Map<String, dynamic> map) {
    var record = Record(map['title'], map['artist'], map['genre'], map['releaseYear'], map['dateAcquired'], map['cover'] == '' ? null : File(map['cover']));
    record.id = map['id'];
    return record;
  }
}
