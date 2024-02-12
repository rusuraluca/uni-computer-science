import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

import '../api/api.dart';
import '../api/network.dart';
import '../widgets/message.dart';

class ProgressSection extends StatefulWidget {
  const ProgressSection({super.key});

  @override
  _ProgressSectionState createState() => _ProgressSectionState();
}

class _ProgressSectionState extends State<ProgressSection> {
  var logger = Logger();
  bool online = true;
  late Map<List<DateTime>, int> caloriesBurnedPerWeek = {};
  late List<MapEntry<String, int>> topThreeTypes = [];
  bool isLoading = false;
  Map _source = {ConnectivityResult.none: false};
  final NetworkConnectivity _connectivity = NetworkConnectivity.instance;
  String string = '';

  @override
  void initState() {
    super.initState();
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
      getCaloriesBurnedPerWeek();
      getTopThreeTypes();
    });
  }

  getCaloriesBurnedPerWeek() async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    logger.log(Level.info, 'getCaloriesBurnedPerWeek');
    try {
      if (online) {
        caloriesBurnedPerWeek =
            await ApiService.instance.getCaloriesBurnedPerWeek();
      } else {
        message(context, "No internet connection", "Error");
      }
    } catch (e) {
      logger.log(Level.error, e.toString());
      message(context, "Error loading items from server", "Error");
    }
    setState(() {
      isLoading = false;
    });
  }

  getTopThreeTypes() async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    logger.log(Level.info, 'getTopThreeTypes');
    try {
      if (online) {
        topThreeTypes = await ApiService.instance.getTop3TypesByTotalDistance();
      } else {
        message(context, "No internet connection", "Error");
      }
    } catch (e) {
      logger.log(Level.error, e.toString());
      message(context, "Error loading items from server", "Error");
    }
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Price section'),
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator())
            : Center(
                child: ListView(children: [
                const Text('Calories burned per week:'),
                ListView.builder(
                  itemCount: caloriesBurnedPerWeek.length,
                  itemBuilder: (context, index) {
                    var key = caloriesBurnedPerWeek.keys.elementAt(index);
                    return ListTile(
                      title: Text(
                          '${key.first.toString().split(' ')[0]} - ${key.last.toString().split(' ')[0]}'),
                      subtitle:
                          Text('Total calories: ${caloriesBurnedPerWeek[key]}'),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: const BorderSide(
                          color: Colors.grey,
                          width: 1.0,
                        ),
                      ),
                    );
                  },
                  physics: const ScrollPhysics(),
                  shrinkWrap: true,
                  scrollDirection: Axis.vertical,
                  padding: const EdgeInsets.all(10),
                ),
                const Text('Top 3 types by total distance:'),
                ListView.builder(
                  itemCount: topThreeTypes.length,
                  itemBuilder: (context, index) {
                    var key = topThreeTypes.elementAt(index);
                    return ListTile(
                      title: Text(key.key),
                      subtitle:
                          Text('Total distance: ${topThreeTypes[index].value}'),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: const BorderSide(
                          color: Colors.grey,
                          width: 1.0,
                        ),
                      ),
                    );
                  },
                  shrinkWrap: true,
                  padding: const EdgeInsets.all(10),
                ),
              ])));
  }

  @override
  void dispose() {
    super.dispose();
  }
}
