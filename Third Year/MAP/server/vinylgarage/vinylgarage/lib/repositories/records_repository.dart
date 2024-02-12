import '../../models/record.dart';

abstract class RecordsRepository {
  Future<void> add(Record record);

  Future<void> remove(int id);

  Future<void> update(int id, Record record);

  Future<List<Record>> getAll();
}