import 'package:logger/logger.dart';
import '../../models/item.dart';

class LocalRepository {
  final List<Item> _items = [];
  final Map<String, List<Item>> _itemsByAttribute = {};
  final Set<String> _attributes = {};
  final Logger _logger = Logger();

  Future<void> addItem(Item item) async {
    _items.add(item);
    _addItemToAttribute(item);
    _attributes.add(item.type);
    _logger.i('Added item: ${item.name}');
  }

  Future<void> removeItem(int id) async {
    final item = _items.firstWhere((item) => item.id == id);
    _items.remove(item);
    _itemsByAttribute[item.type]?.remove(item);
    if (_itemsByAttribute[item.type]?.isEmpty ?? true) {
      _attributes.remove(item.type);
    }
    _logger.i('Removed item: ${item.name}');
  }

  Future<void> updateItems(List<Item> updatedItems) async {
    _items.clear();
    _items.addAll(updatedItems);
    _logger.i('Updated items: $updatedItems');
  }

  Future<void> updateAttributes(List<String> updatedAttributes) async {
    _attributes.clear();
    _attributes.addAll(updatedAttributes);
    _logger.i('Updated attributes: $updatedAttributes');
  }

  Future<void> updateItemsByAttribute(String attribute, List<Item> updatedItems) async {
    _itemsByAttribute[attribute]?.clear();
    _itemsByAttribute[attribute]?.addAll(updatedItems);
    _logger.i('Updated items by attribute: $updatedItems');
  }

  Future<List<Item>> getItems() async {
    _logger.i('Fetching all items');
    return _items;
  }

  Future<List<Item>> getItemsByAttribute(String attribute) async {
    _logger.i('Fetching items by attribute: $attribute');
    return _itemsByAttribute[attribute] ?? [];
  }

  Future<List<String>> getAttributes() async {
    _logger.i('Fetching all attributes');
    return _attributes.toList();
  }

  void _addItemToAttribute(Item item) {
    _itemsByAttribute.putIfAbsent(item.type, () => []).add(item);
  }
}
