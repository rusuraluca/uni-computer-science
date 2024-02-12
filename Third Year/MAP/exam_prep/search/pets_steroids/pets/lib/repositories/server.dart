import 'package:dio/dio.dart';
import '../models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2309'; //TODO: CHANGE HERE

class ServerRepository {
  static final ServerRepository instance = ServerRepository._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ServerRepository._init();

  //TODO: CHANGE HERE
  Future<List<dynamic>> getAttributes() async {
    logger.log(Level.info, "getAttributes() called");
    final response = await dio.get('$baseUrl/pets');
    logger.log(Level.info, "getAttributes() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List)
        .map((e) => [e['id'], e['name']])
        .toList();
    } else {
      logger.log(Level.error, "getAttributes() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  //TODO: CHANGE HERE
  Future<List<Item>> getItemsByAttribute(int attribute) async {
    logger.log(Level.info, "getItemsByAttribute() called");
    final response = await dio.get('$baseUrl/pet/$attribute');
    logger.log(Level.info, "getItemsByAttribute() response: $response");
    if (response.statusCode == 200) {
      final Item pet = Item.fromJson(response.data);
      logger.log(Level.info, "getPetById() parsed pet: $pet");
      return [pet];
    } else {
      logger.log(Level.error, "getItemsByAttribute() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<Item> addItem(Item item) async {
    logger.log(Level.info, "addItem() called");
    final response = await dio.post('$baseUrl/pet', data: item.toJsonWithoutId());
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
    final response = await dio.delete('$baseUrl/pet/$id');
    logger.log(Level.info, "deleteItem() response: $response");
    if (response.statusCode != 200) {
      logger.log(Level.error, "deleteItem() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<List<Item>> searchItem(String criteria, String criteriaValue) async {
    logger.log(Level.info, "searchItem() called");
    final response = await dio.get('$baseUrl/search');
    logger.log(Level.info, "searchItem() response: $response");
    try {
      if (response.statusCode == 200) {
        final List<dynamic> jsonList = response.data;
        List<Item> items = jsonList.map((json) => Item.fromJson(json)).toList();

        if (criteria == 'breed') {
          items = items.where((item) => item.breed == criteriaValue).toList();
        } else if (criteria == 'age') {
          items = items.where((item) => item.age.toString() == criteriaValue).toList();
        } else if (criteria == 'location') {
          items = items.where((item) => item.location == criteriaValue).toList();
        } else if (criteria == 'weight') {
          items = items.where((item) => item.weight.toString() == criteriaValue).toList();
        }

        items.sort((a, b) {
          int weightComparison = b.weight.compareTo(a.weight);
          if (weightComparison != 0) {
            return weightComparison;
          } else {
            return a.age.compareTo(b.age);
          }
        });

        return items;
      } else {
        logger.log(Level.error, "searchItem() error: ${response.statusMessage}");
        throw Exception('Failed to fetch pets: ${response.statusMessage}');
      }
    } catch (error) {
      logger.log(Level.error, "searchItem() error: ${response.statusMessage}");
      throw Exception('Error: $error');
    }
  }
}
