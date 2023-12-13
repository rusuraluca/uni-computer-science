import 'dart:io';

class Record {
  final int? id;
  String title;
  String artist;
  String genre;
  int releaseYear;
  DateTime dateAcquired;
  File? cover;

  Record({
    this.id,
    required this.title,
    required this.artist,
    required this.genre,
    required this.releaseYear,
    required this.dateAcquired,
    required this.cover,
  });

  // Serialization
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'artist': artist,
      'genre': genre,
      'releaseYear': releaseYear,
      'dateAcquired': dateAcquired.toIso8601String(),
      'cover': cover?.path,
    };
  }

  // Deserialization
  factory Record.fromMap(Map<String, dynamic> map) {
    return Record(
      id: map['id'],
      title: map['title'],
      artist: map['artist'],
      genre: map['genre'],
      releaseYear: map['releaseYear'],
      dateAcquired: DateTime.parse(map['dateAcquired']),
      cover: map['cover'] == null ? null : File(map['cover']),
    );
  }
}
