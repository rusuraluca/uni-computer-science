import 'package:dio/dio.dart';
import '../models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2320'; //TODO: CHANGE HERE

class ServerRepository {
  static final ServerRepository instance = ServerRepository._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ServerRepository._init();

  Future<List<Item>> getItems() async {
    logger.log(Level.info, "getItems() called");
    final response = await dio.get('$baseUrl/all');
    logger.log(Level.info, "getItems() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List)
        .map((e) => Item.fromJson(e))
        .toList();
    } else {
      logger.log(Level.error, "getItems() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  //TODO: CHANGE HERE
  Future<List<String>> getAttributes() async {
    logger.log(Level.info, "getAttributes() called");
    final response = await dio.get('$baseUrl/types');
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

  //TODO: CHANGE HERE
  Future<List<Item>> getItemsByAttribute(String attribute) async {
    logger.log(Level.info, "getItemsByAttribute() called");
    final response = await dio.get('$baseUrl/meals/$attribute');
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
    final response = await dio.post('$baseUrl/meal', data: item.toJsonWithoutId());
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
    final response = await dio.delete('$baseUrl/meal/$id');
    logger.log(Level.info, "deleteItem() response: $response");
    if (response.statusCode != 200) {
      logger.log(Level.error, "deleteItem() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }



  //TODO: CHANGE HERE
  Future<List<Item>> getTopXItems(int x) async {
    logger.log(Level.info, "getTopXItems() called");
    try {
      final items = await getItems();
      items.sort((a, b) => b.calories.compareTo(a.calories));
      return items.take(x).toList();
    } catch (e) {
      logger.log(Level.error, "getTopXItems() error: $e");
      throw Exception(e);
    }
  }

  //TODO: CHANGE HERE
  Future<Map<String, int>> getTotalCaloriesByType() async {
    try {
      final types = await getAttributes();
      final Map<String, int> caloriesByType = {};
      for (String type in types) {
        final meals = await getItemsByAttribute(type);
        final totalCalories = meals.fold<int>(
          0,
          (total, meal) => total + meal.calories,
        );
        caloriesByType[type] = totalCalories;
      }
      return caloriesByType;
    } catch (e) {
      throw Exception("Error while calculating total calories by type: $e");
    }
  }

  //TODO: CHANGE HERE
  Future<List<Item>> getMealsByDateRange(String startDateStr, String endDateStr) async {
    try {
      final meals = await getItems();
      final startDate = DateTime.parse(startDateStr);
      final endDate = DateTime.parse(endDateStr);
      meals.retainWhere(
        (meal) {
          final mealDate = DateTime.parse(meal.date);
          return mealDate.isAfter(startDate) && mealDate.isBefore(endDate);
        },
      );
      meals.sort((a, b) => a.date.compareTo(b.date));
      return meals;
    } catch (e) {
      throw Exception("Error while fetching meals by date range: $e");
    }
  }
}
