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

  Future<List<Item>> getItems() async {
    try {
      List<Item> items = [];
      if (online) {
        items = await _serverRepo.getItems();
        await _dbRepo.updateItems(items);
      } else {
        items = await _dbRepo.getItems();
      }
      return items;
    } catch (e) {
      logger.e(e);
      return [];
    }
  }

  Future<List<Item>> getItemsSorted() async {
    try {
      List<Item> items = [];
      if (online) {
        items = await _serverRepo.getItems();
        await _dbRepo.updateItems(items);
      } else {
        items = await _dbRepo.getItems();
      }

      items.sort((a, b) {
        int categoryComparison = a.category.compareTo(b.category);
        if (categoryComparison != 0) {
          return categoryComparison;
        } else {
          return a.capacity.compareTo(b.capacity);
        }
      });

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

  Future<void> reserve(int id) async {
    if (!online) {
      throw Exception("Operation not available offline");
    }
    try {
      await _serverRepo.reserveEvent(id);
    } catch (e) {
      logger.e(e);
      throw Exception(e);
    }
  }

  Future<void> attend(int id) async {
    if (!online) {
      throw Exception("Operation not available offline");
    }
    try {
      await _serverRepo.attendEvent(id);
    } catch (e) {
      logger.e(e);
      throw Exception(e);
    }
  }

  Future<List<Item>> getReservedEvents() async {
    try {
      List<Item> items = [];
      if (online) {
        items = await _serverRepo.getAttributes();
        await _dbRepo.updateAttributes(items);
      } else {
        items = await _dbRepo.getAttributes();
      }
      return items;
    } catch (e) {
      logger.e(e);
      return [];
    }
  }
}