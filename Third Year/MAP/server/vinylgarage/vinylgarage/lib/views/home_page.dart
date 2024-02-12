import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/records_service.dart';
import '../utils/pair.dart';
import 'add_page.dart';
import 'record_widget.dart';

class HomePageWidget extends StatelessWidget {
  const HomePageWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(builder: (context) => const RecordsAddPage())
          );
        },
        backgroundColor: Colors.blue,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: Consumer<RecordsService>(
        builder: (context, recordsService, child) {
          return FutureBuilder<Pair>(
            future: recordsService.getAllRecords(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              }
              if (!snapshot.hasData || snapshot.data!.left.isEmpty) {
                return const Center(child: Text("No records available"));
              }

              if (snapshot.hasError) {
                return Center(child: Text("Error: ${snapshot.error}"));
              }

              var records = snapshot.data!.left;
              return ListView.builder(
                itemCount: records.length,
                itemBuilder: (context, index) {
                  return RecordWidget(record: records[index]);
                }
              );
            }
          );
        },
      ),
    );
  }
}
