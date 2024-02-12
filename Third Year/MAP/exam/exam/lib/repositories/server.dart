import 'package:dio/dio.dart';
import '../models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2429';

class ServerRepository {
  static final ServerRepository instance = ServerRepository._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ServerRepository._init();

  Future<List<Item>> getItems() async {
    logger.log(Level.info, "getItems() called");
    final response = await dio.get('$baseUrl/events');
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

  Future<List<Item>> getAttributes() async {
    logger.log(Level.info, "getAttributes() called");
    final response = await dio.get('$baseUrl/reserved');
    logger.log(Level.info, "getAttributes() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List)
        .map((e) => Item.fromJson(e))
        .toList();
    } else {
      logger.log(Level.error, "getAttributes() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<Item> addItem(Item item) async {
    logger.log(Level.info, "addItem() called");
    final response = await dio.post('$baseUrl/event', data: item.toJsonWithoutId());
    logger.log(Level.info, "addItem() response: $response");
    if (response.statusCode == 200) {
      return Item.fromJson(response.data);
    } else {
      logger.log(Level.error, "addItem() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<bool> reserveEvent(int eventId) async {
    logger.log(Level.info, "reserveEvent() called for event ID: $eventId");
    try {
      final response = await dio.put('$baseUrl/reserve/$eventId');
      logger.log(Level.info, "reserveEvent() response: $response");
      return response.statusCode == 200;
    } catch (e) {
      logger.log(Level.error, "reserveEvent() error: $e");
      throw Exception('Error in reserveEvent: $e');
    }
  }

  Future<List<Item>> getReservedEvents() async {
    logger.log(Level.info, "getReservedEvents() called");
    try {
      final response = await dio.get('$baseUrl/reserved');
      logger.log(Level.info, "getReservedEvents() response: $response");
      if (response.statusCode == 200) {
        return (response.data as List)
            .map((e) => Item.fromJson(e))
            .toList();
      } else {
        throw Exception('Failed to get reserved events');
      }
    } catch (e) {
      logger.log(Level.error, "getReservedEvents() error: $e");
      throw Exception('Error in getReservedEvents: $e');
    }
  }

  Future<bool> attendEvent(int eventId) async {
    logger.log(Level.info, "attendEvent() called for event ID: $eventId");
    try {
      final response = await dio.put('$baseUrl/attend/$eventId');
      logger.log(Level.info, "attendEvent() response: $response");
      return response.statusCode == 200;
    } catch (e) {
      logger.log(Level.error, "attendEvent() error: $e");
      throw Exception('Error in attendEvent: $e');
    }
  }
}
