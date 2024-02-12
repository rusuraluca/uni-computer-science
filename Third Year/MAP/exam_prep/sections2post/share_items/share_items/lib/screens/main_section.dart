import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:share_items/api/api.dart';
import 'package:share_items/screens/add_item.dart';
import 'package:share_items/screens/items_list_page.dart';
import 'package:share_items/services/database_helper.dart';

import '../api/network.dart';
import '../models/item.dart';
import '../widgets/message.dart';

class MainSection extends StatefulWidget {
  const MainSection({super.key});

  @override
  _MainSectionState createState() => _MainSectionState();
}

class _MainSectionState extends State<MainSection> {
  var logger = Logger();
  bool online = true;
  late List<String> categories = [];
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
      getCategories();
    });
  }

  getCategories() async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    if (online) {
      try {
        categories = await ApiService.instance.getCategories();
        DatabaseHelper.updateCategories(categories);
      } catch (e) {
        logger.e(e);
        message(context, "Error connecting to the server", "Error");
      }
    } else {
      categories = await DatabaseHelper.getCategories();
    }

    setState(() {
      isLoading = false;
    });
  }

  saveItem(Item item) async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    if (online) {
      try {
        final Item received = await ApiService.instance.addItem(item);
        DatabaseHelper.addItem(received);
      } catch (e) {
        logger.e(e);
        message(context, "Error connecting to the server", "Error");
      }
    } else {
      message(context, "Operation not available", "Error");
    }
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Main section'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Center(
              child: ListView(
              children: [
                ListView.builder(
                  itemBuilder: ((context, index) {
                    return ListTile(
                      title: Text(categories[index]),
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    ItemsListPage(categories[index])));
                      },
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: const BorderSide(
                          color: Colors.grey,
                          width: 1.0,
                        ),
                      ),
                    );
                  }),
                  itemCount: categories.length,
                  physics: const ScrollPhysics(),
                  shrinkWrap: true,
                  scrollDirection: Axis.vertical,
                  padding: const EdgeInsets.all(10),
                ),
              ],
            )),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (!online) {
            message(context, "Operation not available", "Error");
            return;
          }
          Navigator.push(
                  context, MaterialPageRoute(builder: ((context) => const AddItem())))
              .then((value) {
            if (value != null) {
              setState(() {
                saveItem(value);
              });
            }
          });
        },
        tooltip: 'Add item',
        child: const Icon(Icons.add),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}
