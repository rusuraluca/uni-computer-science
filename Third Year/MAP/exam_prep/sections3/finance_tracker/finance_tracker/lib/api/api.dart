import 'package:dio/dio.dart';
import 'package:finance_tracker/models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2307';

class ApiService {
  static final ApiService instance = ApiService._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ApiService._init();

  Future<List<String>> getDates() async {
    logger.log(Level.info, "getDates() called");
    final response = await dio.get('$baseUrl/days');
    logger.log(Level.info, "getDates() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List).map((e) => e as String).toList();
    } else {
      logger.log(Level.error, "getDates() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<List<FinanceData>> getFinanceDataByDate(String date) async {
    logger.log(Level.info, "getFinanceDataByDate() called");
    final response = await dio.get('$baseUrl/transactions/$date');
    logger.log(Level.info, "getFinanceDataByDate() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List)
          .map((e) => FinanceData.fromJson(e))
          .toList();
    } else {
      logger.log(Level.error,
          "getFinanceDataByDate() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<FinanceData> addFinanceData(FinanceData financeData) async {
    logger.log(Level.info, "addFinanceData() called");
    final response =
        await dio.post('$baseUrl/transaction', data: financeData.toJsonWithoutId());
    logger.log(Level.info, "addFinanceData() response: $response");
    if (response.statusCode == 200) {
      return FinanceData.fromJson(response.data);
    } else {
      logger.log(
          Level.error, "addFinanceData() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  void deleteFinanceData(int id) async {
    logger.log(Level.info, "deleteFinanceData() called");
    final response = await dio.delete('$baseUrl/transaction/$id');
    logger.log(Level.info, "deleteFinanceData() response: $response");
    if (response.statusCode != 200) {
      logger.log(
          Level.error, "deleteFinanceData() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  // get total amount for each week
  Future<Map<List<DateTime>, double>> getAmountPerWeek() async {
    logger.log(Level.info, "getAmountPerWeek() called");
    final response = await dio.get('$baseUrl/entries');
    logger.log(Level.info, "getAmountPerWeek() response: $response");
    if (response.statusCode == 200) {
      // get the smallest and biggest date
      final dates = (response.data as List)
          .map((e) => FinanceData.fromJson(e))
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
      // compute the total amount for each week
      final amountPerWeek = <List<DateTime>, double>{};
      for (final week in weeks) {
        final amount = (response.data as List)
            .map((e) => FinanceData.fromJson(e))
            .where((e) =>
                DateTime.parse(e.date).isAfter(week.first) &&
                DateTime.parse(e.date).isBefore(week.last))
            .map((e) => e.amount)
            .reduce((value, element) => value + element);
        amountPerWeek[week] = amount;
      }
      logger.log(Level.info,
          "getAmountPerWeek() result: $amountPerWeek");
      return amountPerWeek;
    } else {
      logger.log(Level.error,
          "getAmountPerWeek() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  // get the top 3 types of categories by total transactions
  Future<List<MapEntry<String, int>>> getTop3TypesByTotalTransactions() async {
    logger.log(Level.info, "getTop3TypesByTotalTransactions() called");
    final response = await dio.get('$baseUrl/entries');
    logger.log(Level.info, "getTop3TypesByTotalTransactions() response: $response");
    if (response.statusCode == 200) {
      final categories = (response.data as List)
          .map((e) => FinanceData.fromJson(e))
          .map((e) => e.category)
          .toSet()
          .toList();
      final totalTransactions = <String, int>{};
      for (final category in categories) {
        final totalTransaction = (response.data as List)
            .map((e) => FinanceData.fromJson(e))
            .where((e) => e.category == category)
            .map((e) => 1)
            .reduce((value, element) => value + element);
        totalTransactions[category] = totalTransaction;
      }
      var result = Map.fromEntries(totalTransactions.entries.toList()
        ..sort((e1, e2) => e2.value.compareTo(e1.value))
        ..sublist(0, 3));
      logger.log(Level.info, "getTop3TypesByTotalTransactions() result: $result");
      return result.entries.toList().sublist(0, 3);
    } else {
      logger.log(Level.error,
          "getTop3TypesByTotalTransactions() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }
}
