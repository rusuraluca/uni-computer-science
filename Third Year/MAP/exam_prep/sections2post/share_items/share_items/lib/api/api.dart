import 'package:dio/dio.dart';
import 'package:logger/logger.dart';
import '../models/item.dart';

const String baseUrl = 'http://10.0.2.2:2325';

class ApiService {
  static final ApiService instance = ApiService._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ApiService._init();

  Future<List<String>> getCategories() async {
    logger.log(Level.info, 'getCategories');
    final response = await dio.get('$baseUrl/categories');
    logger.log(Level.info, response.data);
    if (response.statusCode == 200) {
      final result = response.data as List;
      return result.map((e) => e.toString()).toList();
    } else {
      throw Exception(response.statusMessage);
    }
  }

  Future<List<Item>> getItemsByCategory(String category) async {
    logger.log(Level.info, 'getItemsByCategory');
    final response = await dio.get('$baseUrl/items/$category');
    logger.log(Level.info, response.data);
    if (response.statusCode == 200) {
      final result = response.data as List;
      return result.map((e) => Item.fromJson(e)).toList();
    } else {
      throw Exception(response.statusMessage);
    }
  }

  Future<List<Item>> getDiscountedItems() async {
    logger.log(Level.info, 'getDiscountedItems');
    final response = await dio.get('$baseUrl/discounted');
    logger.log(Level.info, response.data);
    if (response.statusCode == 200) {
      final result = response.data as List;
      var items = result.map((e) => Item.fromJson(e)).toList();
      // return top 10 items sorted ascending by price and number of units
      items.sort((a, b) {
        int first = a.price.compareTo(b.price);
        if (first == 0) {
          return a.units.compareTo(b.units);
        } else {
          return first;
        }
      });
      return items.sublist(0, 10);
    } else {
      throw Exception(response.statusMessage);
    }
  }

  Future<Item> addItem(Item item) async {
    logger.log(Level.info, 'addItem: $item');
    final response =
        await dio.post('$baseUrl/item', data: item.toJsonWithoutId());
    logger.log(Level.info, response.data);
    if (response.statusCode == 200) {
      return Item.fromJson(response.data);
    } else {
      throw Exception(response.statusMessage);
    }
  }

  void deleteItem(int id) async {
    logger.log(Level.info, 'deleteItem: $id');
    final response = await dio.delete('$baseUrl/item/$id');
    logger.log(Level.info, response.data);
    if (response.statusCode != 200) {
      throw Exception(response.statusMessage);
    }
  }

  void updatePrice(int id, double price) async {
    logger.log(Level.info, 'updatePrice: $id, $price');
    final response =
        await dio.post('$baseUrl/price', data: {'id': id, 'price': price});
    logger.log(Level.info, response.data);
    if (response.statusCode != 200) {
      throw Exception(response.statusMessage);
    }
  }
}
