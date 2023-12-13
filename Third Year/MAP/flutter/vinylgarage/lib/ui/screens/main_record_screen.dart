import 'package:flutter/material.dart';
import '../../providers/record_provider.dart';
import 'package:provider/provider.dart';

import '../widgets/record_widget.dart';

class MainRecordScreen extends StatelessWidget {
  const MainRecordScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    RecordProvider provider = Provider.of<RecordProvider>(context);

    return Scaffold(
          appBar: AppBar(
            title: const Text('Vinyl Collection',
                style: TextStyle(color: Colors.black)),
            backgroundColor: Colors.white,
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: () async {
              await Navigator.pushNamed(context, '/new_record_screen');
            },
            backgroundColor: Colors.blue,
            child: const Icon(Icons.add, color: Colors.white),
          ),
          body: ListView.builder(
            itemCount: provider.allRecords.length,
            itemBuilder: (context, index) {
              var record = provider.allRecords[index];
              return RecordWidget(
                key: ValueKey(record.id),
                record: record,
              );
            },
          )
    );
  }
}
