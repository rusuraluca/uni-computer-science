import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import '../repositories/server.dart';
import '../repositories/network.dart';
import '../repositories/database.dart';
import '../models/item.dart';

class DataService extends ChangeNotifier {
  final DatabaseRepository _dbRepo;
  final ServerRepository _serverRepo;
  final NetworkConnectivity _connectivity;
  bool online = false;
  static Logger logger = Logger();
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  String string = '';

  static Future<DataService> init() async {
    return DataService(DatabaseRepository(), ServerRepository.instance, NetworkConnectivity.instance);
  }

  DataService(this._dbRepo, this._serverRepo, this._connectivity) {
    connection();
  }

  void connection() {
    _connectivity.initialize();
    _connectivity.myStream.listen((source) {
      _source = source;
      var newStatus = true;
      switch (_source.keys.toList()[0]) {
        case ConnectivityResult.mobile:
          string =
              _source.values.toList()[0] ? 'Mobile: online' : 'Mobile: offline';
          break;
        case ConnectivityResult.wifi:
          string =
              _source.values.toList()[0] ? 'Wifi: online' : 'Wifi: offline';
          newStatus = _source.values.toList()[0] ? true : false;
          break;
        case ConnectivityResult.none:
        default:
          string = 'Offline';
          newStatus = false;
      }
      if (online != newStatus) {
        online = newStatus;
      }
    });
  }

  Future<List<String>> getAttributes() async {
    try {
      List<String> attributes = [];
      if (online) {
        attributes = await _serverRepo.getAttributes();
        await _dbRepo.updateAttributes(attributes);
      } else {
        attributes = await _dbRepo.getAttributes();
      }
      return attributes;
    } catch (e) {
      logger.e(e);
      return [];
    }
  }

  Future<List<Item>> getItemsByAttribute(String attribute) async {
    try {
      List<Item> items = [];
      if (online) {
        items = await _serverRepo.getItemsByAttribute(attribute);
        await _dbRepo.updateItemsByAttribute(attribute, items);
      } else {
        items = await _dbRepo.getItemsByAttribute(attribute);
      }
      return items;
    } catch (e) {
      logger.e(e);
      return [];
    }
  }

  Future<void> addItem(Item item) async {
    if (!online) {
      throw Exception("Operation not available offline");
    }
    try {
      var newItem = await _serverRepo.addItem(item);
      await _dbRepo.addItem(newItem);
      notifyListeners();
    } catch (e) {
      logger.e(e);
      throw Exception(e);
    }
  }

  Future<void> deleteItem(int id) async {
    if (!online) {
      throw Exception("Operation not available offline");
    }
    try {
      _serverRepo.deleteItem(id);
      _dbRepo.deleteItem(id);
      notifyListeners();
    } catch (e) {
      logger.e(e);
      throw Exception(e);
    }
  }

  Future<Map<List<DateTime>, int>> getCaloriesBurnedPerWeek() async {
    try {
      Map<List<DateTime>, int> caloriesBurnedPerWeek = {};
      if (online) {
        caloriesBurnedPerWeek =
            await _serverRepo.getCaloriesBurnedPerWeek();
      }
      return caloriesBurnedPerWeek;
    } catch (e) {
      logger.e(e);
      return {};
    }
  }

  Future<List<MapEntry<String, int>>> getTop3TypesByTotalDistance() async {
    try {
      List<MapEntry<String, int>> top3TypesByTotalDistance = [];
      if (online) {
        top3TypesByTotalDistance =
            await _serverRepo.getTop3TypesByTotalDistance();
      }
      return top3TypesByTotalDistance;
    } catch (e) {
      logger.e(e);
      return [];
    }
  }

}
