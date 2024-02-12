import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:logger/logger.dart';
import 'package:share_items/api/api.dart';
import 'package:share_items/models/item.dart';
import 'package:share_items/screens/edit_item.dart';
import 'package:share_items/widgets/message.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../api/network.dart';
import '../services/database_helper.dart';

class PriceSection extends StatefulWidget {
  const PriceSection({super.key});

  @override
  _PriceSectionState createState() => _PriceSectionState();
}

class _PriceSectionState extends State<PriceSection> {
  var logger = Logger();
  bool online = true;
  late List<Item> discountedItems = [];
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
      getDiscountedItems();
    });
  }

  getDiscountedItems() async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    logger.log(Level.info, 'getDiscountedItems');
    try {
      if (online) {
        discountedItems = await ApiService.instance.getDiscountedItems();
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

  updatePrice(Item item) async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    logger.log(Level.info, 'updatePrice');
    try {
      if (online) {
        ApiService.instance.updatePrice(item.id!, item.price);
      } else {
        message(context, "No internet connection", "Error");
      }
    } catch (e) {
      logger.log(Level.error, e.toString());
      message(context, "Error updating price", "Error");
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
                ListView.builder(
                  itemCount: discountedItems.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(discountedItems[index].name),
                      subtitle: Text(
                          '${discountedItems[index].description}, ${discountedItems[index].image}, ${discountedItems[index].category}, units: ${discountedItems[index].units}, price: ${discountedItems[index].price}'),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: const BorderSide(
                          color: Colors.grey,
                          width: 1.0,
                        ),
                      ),
                      onTap: () {
                        Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => EditItemPage(
                                        item: discountedItems[index])))
                            .then((value) {
                          if (value != null) {
                            setState(() {
                              updatePrice(value);
                              getDiscountedItems();
                            });
                          }
                        });
                      },
                    );
                  },
                  physics: const ScrollPhysics(),
                  shrinkWrap: true,
                  scrollDirection: Axis.vertical,
                  padding: const EdgeInsets.all(10),
                )
              ])));
  }

  @override
  void dispose() {
    super.dispose();
  }
}
