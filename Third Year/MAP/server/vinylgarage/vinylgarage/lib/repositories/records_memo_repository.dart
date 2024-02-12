import '../../models/record.dart';
import '../../repositories/records_repository.dart';

class RecordsMemoryRepository implements RecordsRepository {
  final List<Record> elements = [];

  @override
  Future<void> add(Record record) async {
    elements.add(record);
  }

  @override
  Future<void> remove(int id) async {
    Record record = elements.where((element) => element.id == id).first;
    elements.remove(record);
  }

  @override
  Future<void> update(int id, Record record) async {
    record.id = id;
    elements[elements.indexWhere((element) => element.id == id)] = record;
  }

  @override
  Future<List<Record>> getAll() async {
    return elements;
  }
}