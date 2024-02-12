import 'dart:developer';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/record.dart';
import '../../services/records_service.dart';
import 'home_page.dart';
import 'package:image_picker/image_picker.dart';

class RecordDetailsWidget extends StatefulWidget {
  final Record record;

  const RecordDetailsWidget(this.record, {Key? key}) : super(key: key);

  @override
  State<RecordDetailsWidget> createState() => _RecordDetailsWidgetState();
}

class _RecordDetailsWidgetState extends State<RecordDetailsWidget> {
  late final TextEditingController titleController;
  late final TextEditingController artistController;
  late final TextEditingController genreController;
  late final TextEditingController releaseYearController;
  late final TextEditingController dateAcquiredController;
  late String _pickedImage = '';
  bool _isImagePickerActive = false;

  Future<void> _pickImage() async {
    if (_isImagePickerActive) {
      return;
    }

    setState(() {
      _isImagePickerActive = true;
    });

    final picker = ImagePicker();
    try {
      final pickedImage = await picker.pickImage(source: ImageSource.gallery);
      setState(() {
        _pickedImage = pickedImage != null ? pickedImage.path : '';
      });
    } on Exception catch (e) {
      log("ERROR: $e");
      rethrow;
    } finally {
      setState(() {
        _isImagePickerActive = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    titleController = TextEditingController(text: widget.record.title);
    artistController = TextEditingController(text: widget.record.artist);
    genreController = TextEditingController(text: widget.record.genre);
    releaseYearController = TextEditingController(text: widget.record.releaseYear.toString());
    dateAcquiredController = TextEditingController(text: widget.record.dateAcquired);
    _pickedImage = widget.record.cover?.path ?? "";
    _isImagePickerActive = false;
  }


  @override
  void dispose() {
    titleController.dispose();
    artistController.dispose();
    genreController.dispose();
    releaseYearController.dispose();
    dateAcquiredController.dispose();
    super.dispose();
  }

  void showAlertDialog(String message) {
    Widget okButton = TextButton(
      child: const Text("OK"),
      onPressed: () {
        Navigator.pop(context);
      },
    );

    AlertDialog alert = AlertDialog(
      title: const Text("Error"),
      content: Text(message),
      actions: [
        okButton,
      ],
    );

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  void showAreYouSureDialog() {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Confirm Deletion'),
            content: const Text('Are you sure you want to remove this record from your collection?'),
            actions: [
              TextButton(
                child: const Text("Cancel"),
                onPressed: () => Navigator.pop(context),
              ),
              TextButton(
                child: const Text("Yes"),
                onPressed: () {
                  Provider.of<RecordsService>(context, listen: false).remove(widget.record.id);
                  // Navigate back to the home page after deletion
                  Navigator.pop(context); // Close the dialog
                  Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const HomePageWidget()));
                },
              ),
            ],
          );
        },
      );
  }

  bool _validateInputs() {
    if (titleController.text.isEmpty) {
      showAlertDialog("Title is required.");
      return false;
    }
    if (artistController.text.isEmpty) {
      showAlertDialog("Artist is required.");
      return false;
    }
    if (genreController.text.isEmpty) {
      showAlertDialog("Genre is required.");
      return false;
    }
    if (releaseYearController.text.isEmpty) {
      showAlertDialog("Release Year is required.");
      return false;
    }
    if (dateAcquiredController.text.isEmpty) {
      showAlertDialog("Date Acquired is required.");
      return false;
    }
    try {
      int.parse(releaseYearController.text);
    } catch (e) {
      showAlertDialog("Invalid Release Year.");
      return false;
    }
    return true;
  }

  void _updateRecord() {
    if (_validateInputs()) {
      var releaseYear = int.parse(releaseYearController.text);
      var dateAcquired = dateAcquiredController.text;
      var cover = _pickedImage.isEmpty ? null : File(_pickedImage);

      Provider.of<RecordsService>(context, listen: false)
        .update(widget.record.id, titleController.text, artistController.text,
                genreController.text, releaseYear, dateAcquired, cover);

      Navigator.pop(context);
    }
  }

  void _deleteRecord() {
    Provider.of<RecordsService>(context, listen: false)
      .remove(widget.record.id);

    Navigator.pop(context);
  }


  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text(widget.record.title),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            ListTile(
              leading: const Icon(Icons.text_fields),
              title: TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: "Title",
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: TextField(
                controller: artistController,
                decoration: const InputDecoration(
                  labelText: "Artist",
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.category),
              title: TextField(
                controller: genreController,
                decoration: const InputDecoration(
                  labelText: "Genre",
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.calendar_today_rounded),
              title: TextField(
                controller: releaseYearController,
                decoration: const InputDecoration(
                  labelText: "Release Year",
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.calendar_month_rounded),
              title: TextField(
                controller: dateAcquiredController,
                decoration: const InputDecoration(
                  labelText: "Date Acquired",
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.image),
              title: GestureDetector(
                onTap: _pickImage,
                child: (_pickedImage.isEmpty || !File(_pickedImage).existsSync())
                    ? const Text("Pick an Image")
                    : Image.file(File(_pickedImage)),
              ),
            ),
            Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.lightGreen,
                ),
                child: SizedBox(
                  width: MediaQuery.of(context).size.width / 2,
                  child: const Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Update record", style: TextStyle(color: Colors.white)),
                    ],
                  ),
                ),
                onPressed: () {
                  _updateRecord();
                },
              )
            ),
            Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                ),
                child: SizedBox(
                  width: MediaQuery.of(context).size.width / 2,
                  child: const Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Delete record", style: TextStyle(color: Colors.white)),
                    ],
                  ),
                ),
                onPressed: () {
                  _deleteRecord();
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
