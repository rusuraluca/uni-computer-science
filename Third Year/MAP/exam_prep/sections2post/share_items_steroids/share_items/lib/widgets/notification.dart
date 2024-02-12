// ignore_for_file: library_private_types_in_public_api

import 'dart:convert';
import 'package:logger/logger.dart';

import '../models/item.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import 'message.dart';

const String wsUrl = 'ws://10.0.2.2:2325'; //TODO: CHANGE HERE

class DataNotification extends StatefulWidget {
  const DataNotification({Key? key}) : super(key: key);

  @override
  _DataNotificationState createState() => _DataNotificationState();
}

class _DataNotificationState extends State<DataNotification> {
  late WebSocketChannel _channel;
  static Logger logger = Logger();

  @override
  void initState() {
    super.initState();
    _connectToWebSocket();
  }

  void _connectToWebSocket() {
    _channel = WebSocketChannel.connect(Uri.parse(wsUrl));
    _channel.stream.listen((data) {
      SchedulerBinding.instance.addPostFrameCallback((_) {
        var item = Item.fromJson(jsonDecode(data.toString()));
        logger.log(Level.info, "DataNotification: $item");
        message(context, item.toString(), "Data added");
      });
    }, onDone: () {
      _reconnectToWebSocket();
    }, onError: (error) {
      logger.e("WebSocket error: $error");
      _reconnectToWebSocket();
    });
  }

  void _reconnectToWebSocket() {
    Future.delayed(const Duration(seconds: 1), () {
      _connectToWebSocket();
    });
  }

  @override
  void dispose() {
    _channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const Text('');
  }
}
