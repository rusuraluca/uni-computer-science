import 'package:connectivity_plus/connectivity_plus.dart';
import '../models/item.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

import '../api/api.dart';
import '../api/network.dart';
import '../services/database_helper.dart';
import '../widgets/message.dart';

class ItemPage extends StatefulWidget {
  final int _id;
  final Function() onDelete;
  const ItemPage(this._id, {super.key, required this.onDelete});

  @override
  State<StatefulWidget> createState() => _ItemPageState();
}

class _ItemPageState extends State<ItemPage> {
  var logger = Logger();
  bool online = true;
  late List<dynamic> data = [];
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
      getPetById();
    });
  }

  getPetById() async {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    logger.log(Level.info, "Online - $online");
    try {
      if (online) {
        data = await ApiService.instance.getPetById(widget._id);
        await DatabaseHelper.updatePetForId(widget._id, data as List<Pet>);
      } else {
        data = await DatabaseHelper.getPetsById(widget._id);
      }
    } catch (e) {
      logger.e(e);
      message(context, "Error when retreiving data from server", "Error");
      data = await DatabaseHelper.getPetsById(widget._id);
    }
    setState(() {
      isLoading = false;
    });
  }

  void deleteData(Pet petData) {
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });
    if (online) {
      try {
        ApiService.instance.deletePet(petData.id!);
        DatabaseHelper.deletePet(petData.id!);
        data.remove(petData);
        widget.onDelete();
        Navigator.pop(context);
        Navigator.pop(context);
      } catch (e) {
        logger.e(e);
        message(context, "Error when deleting data from server", "Error");
      }
    } else {
      message(context, "Operation not available", "Info");
    }
    setState(() {
      isLoading = false;
    });
  }


  removeData(BuildContext context, int id) {
    showDialog(
        context: context,
        builder: ((context) => AlertDialog(
              title: const Text("Delete Data"),
              content: const Text("Are you sure you want to delete this data?"),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text("Cancel"),
                ),
                TextButton(
                  onPressed: () {
                    deleteData(data.firstWhere((element) => element.id == id));
                  },
                  child:
                      const Text("Delete", style: TextStyle(color: Colors.red)),
                ),
              ],
            )));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Pet"),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Center(
              child: ListView(
              children: [
                ListView.builder(
                  itemBuilder: ((context, index) {
                    return ListTile(
                      title: Text(data[index].name),
                      subtitle: Text(
                          'Breed: ${data[index].breed}, Age: ${data[index].age}, Weight: ${data[index].weight}, Owner: ${data[index].owner}, Location: ${data[index].location}, Description: ${data[index].description}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () {
                          removeData(context, data[index].id!);
                        },
                        color: Colors.red,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: const BorderSide(
                          color: Colors.grey,
                          width: 1.0,
                        ),
                      ),
                    );
                  }),
                  itemCount: data.length,
                  physics: const ScrollPhysics(),
                  shrinkWrap: true,
                  scrollDirection: Axis.vertical,
                  padding: const EdgeInsets.all(10),
                ),
              ],
            )),
    );
  }
}
