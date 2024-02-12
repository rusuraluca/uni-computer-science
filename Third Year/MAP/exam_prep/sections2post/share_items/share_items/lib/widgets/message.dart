import 'package:flutter/material.dart';

message(BuildContext context, String message, String messageType) {
  showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(title: Text(messageType), content: Text(message));
      });
}
