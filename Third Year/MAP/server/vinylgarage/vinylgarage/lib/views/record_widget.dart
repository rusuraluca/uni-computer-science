import 'dart:io';

import 'package:flutter/material.dart';
import '../../models/record.dart';
import 'details_page.dart';

class RecordWidget extends StatefulWidget {
  final Record record;
  const RecordWidget({Key? key, required this.record}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _RecordWidgetState createState() => _RecordWidgetState();
}

class _RecordWidgetState extends State<RecordWidget> {
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        _navigateToShowRecordScreen(context);
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
        ),
        margin: const EdgeInsets.all(5),
        padding: const EdgeInsets.all(5),
        child: ListTile(
          key: ValueKey(widget.record.id),
          leading: _buildRecordImage(),
          title: Text(widget.record.title),
          subtitle: Text(widget.record.artist),
        ),
      ),
    );
  }

  Widget _buildRecordImage() {
    Record record = widget.record;
    bool isCoverValid = record.cover != null && File(record.cover!.path).existsSync();

    return SizedBox(
      width: 60,
      height: 70,
      child: !isCoverValid
          ? const CircleAvatar(
              backgroundImage: AssetImage('assets/images/record_default.png'),
            )
          : ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.file(
                File(record.cover!.path),
                fit: BoxFit.cover,
              ),
            ),
    );
  }


  void _navigateToShowRecordScreen(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => RecordDetailsWidget(widget.record)),
    );
  }
}

