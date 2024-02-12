import 'package:dio/dio.dart';
import '../models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2305'; //TODO: CHANGE HERE

class ServerRepository {
  static final ServerRepository instance = ServerRepository._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ServerRepository._init();

  Future<List<String>> getAttributes() async {
    logger.log(Level.info, "getAttributes() called");
    final response = await dio.get('$baseUrl/dates');
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
    final response = await dio.get('$baseUrl/entries/$attribute');
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
    final response = await dio.post('$baseUrl/entry', data: item.toJsonWithoutId());
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
    final response = await dio.delete('$baseUrl/entry/$id');
    logger.log(Level.info, "deleteItem() response: $response");
    if (response.statusCode != 200) {
      logger.log(Level.error, "deleteItem() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  // get total calories burned for each week
  Future<Map<List<DateTime>, int>> getCaloriesBurnedPerWeek() async {
    logger.log(Level.info, "getCaloriesBurnedPerWeek() called");
    final response = await dio.get('$baseUrl/all');
    logger.log(Level.info, "getCaloriesBurnedPerWeek() response: $response");
    if (response.statusCode == 200) {
      // get the smallest and biggest date
      final dates = (response.data as List)
          .map((e) => Item.fromJson(e))
          .map((e) => e.date)
          .toList();
      dates.sort((a, b) => DateTime.parse(a).compareTo(DateTime.parse(b)));
      final firstDate = DateTime.parse(dates.first);
      final lastDate = DateTime.parse(dates.last);
      // split the interval between the first and last date into weeks
      // the weeks list is a list of pairs, where the first element is the start date of the week and the second element is the end date of the week
      final weeks = <List<DateTime>>[];
      var weekStart = firstDate;
      while (weekStart.isBefore(lastDate)) {
        final weekEnd = weekStart.add(const Duration(days: 7));
        weeks.add([weekStart, weekEnd]);
        weekStart = weekEnd;
      }
      // compute the last week in case the interval is not a multiple of 7
      if (weeks.last.last.isBefore(lastDate)) {
        weeks.add([weeks.last.last, lastDate]);
      }
      // compute the total calories burned for each week
      final caloriesBurnedPerWeek = <List<DateTime>, int>{};
      for (final week in weeks) {
        final caloriesBurned = (response.data as List)
            .map((e) => Item.fromJson(e))
            .where((e) =>
                DateTime.parse(e.date).isAfter(week.first) &&
                DateTime.parse(e.date).isBefore(week.last))
            .map((e) => e.calories)
            .reduce((value, element) => value + element);
        caloriesBurnedPerWeek[week] = caloriesBurned;
      }
      logger.log(Level.info,
          "getCaloriesBurnedPerWeek() result: $caloriesBurnedPerWeek");
      return caloriesBurnedPerWeek;
    } else {
      logger.log(Level.error,
          "getCaloriesBurnedPerWeek() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  // get the top 3 types of exercises by total distance
  Future<List<MapEntry<String, int>>> getTop3TypesByTotalDistance() async {
    logger.log(Level.info, "getTop3TypesByTotalDistance() called");
    final response = await dio.get('$baseUrl/all');
    logger.log(Level.info, "getTop3TypesByTotalDistance() response: $response");
    if (response.statusCode == 200) {
      final types = (response.data as List)
          .map((e) => Item.fromJson(e))
          .map((e) => e.type)
          .toSet()
          .toList();
      final totalDistances = <String, int>{};
      for (final type in types) {
        final totalDistance = (response.data as List)
            .map((e) => Item.fromJson(e))
            .where((e) => e.type == type)
            .map((e) => e.distance)
            .reduce((value, element) => value! + element!);
        totalDistances[type] = totalDistance!;
      }
      var result = Map.fromEntries(totalDistances.entries.toList()
        ..sort((e1, e2) => e2.value.compareTo(e1.value))
        ..sublist(0, 3));
      logger.log(Level.info, "getTop3TypesByTotalDistance() result: $result");
      return result.entries.toList().sublist(0, 3);
    } else {
      logger.log(Level.error,
          "getTop3TypesByTotalDistance() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }
}
