import 'package:dio/dio.dart';
import '../models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2325'; //TODO: CHANGE HERE

class ServerRepository {
  static final ServerRepository instance = ServerRepository._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ServerRepository._init();

  Future<List<String>> getAttributes() async {
    logger.log(Level.info, "getAttributes() called");
    final response = await dio.get('$baseUrl/categories');
    logger.log(Level.info, "getAttributes() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List)
        .map((e) => e.toString())
        .toList();
    } else {
      logger.log(Level.error, "getAttributes() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<List<Item>> getItemsByAttribute(String attribute) async {
    logger.log(Level.info, "getItemsByAttribute() called");
    final response = await dio.get('$baseUrl/items/$attribute');
    logger.log(Level.info, "getItemsByAttribute() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List)
        .map((e) => Item.fromJson(e))
        .toList();
    } else {
      logger.log(Level.error, "getItemsByAttribute() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<Item> addItem(Item item) async {
    logger.log(Level.info, "addItem() called");
    final response = await dio.post('$baseUrl/item', data: item.toJsonWithoutId());
    logger.log(Level.info, "addItem() response: $response");
    if (response.statusCode == 200) {
      return Item.fromJson(response.data);
    } else {
      logger.log(Level.error, "addItem() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  void deleteItem(int id) async {
    logger.log(Level.info, "deleteItem() called");
    final response = await dio.delete('$baseUrl/item/$id');
    logger.log(Level.info, "deleteItem() response: $response");
    if (response.statusCode != 200) {
      logger.log(Level.error, "deleteItem() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  void updatePrice(int id, double price) async {
    logger.log(Level.info, 'updatePrice: $id, $price');
    final response = await dio.post('$baseUrl/price', data: {'id': id, 'price': price});
    logger.log(Level.info, response.data);
    if (response.statusCode != 200) {
      logger.log(Level.error, "updatePrice() error: ${response.statusMessage}");
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
}
