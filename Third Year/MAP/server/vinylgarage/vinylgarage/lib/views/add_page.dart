import 'dart:developer';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/records_service.dart';
import 'package:image_picker/image_picker.dart';

class RecordsAddPage extends StatefulWidget {
  const RecordsAddPage({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _RecordsAddPageState createState() => _RecordsAddPageState();
}

class _RecordsAddPageState extends State<RecordsAddPage> {
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
    titleController = TextEditingController();
    artistController = TextEditingController();
    genreController = TextEditingController();
    releaseYearController = TextEditingController();
    dateAcquiredController = TextEditingController();
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

  void showAlertDialog(BuildContext context, String message) {
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

  bool _validateInputs() {
    if (titleController.text.isEmpty) {
      showAlertDialog(context, "Title is required.");
      return false;
    }
    if (artistController.text.isEmpty) {
      showAlertDialog(context, "Artist is required.");
      return false;
    }
    if (genreController.text.isEmpty) {
      showAlertDialog(context, "Genre is required.");
      return false;
    }
    if (releaseYearController.text.isEmpty) {
      showAlertDialog(context, "Release Year is required.");
      return false;
    }
    if (dateAcquiredController.text.isEmpty) {
      showAlertDialog(context, "Date Acquired is required.");
      return false;
    }
    try {
      int.parse(releaseYearController.text);
    } catch (e) {
      showAlertDialog(context, "Invalid Release Year.");
      return false;
    }
    return true;
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Add record'),
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
                child: _pickedImage.isEmpty
                    ? const Text("Pick an Image")
                    : Image.file(File(_pickedImage)),
              ),
            ),
            Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.lightBlue,
                ),
                onPressed: () {
                  if (_validateInputs()) {
                    var releaseYear = int.parse(releaseYearController.text);
                    var dateAcquired = dateAcquiredController.text;
                    var cover = _pickedImage.isEmpty ? null : File(_pickedImage);

                    Provider.of<RecordsService>(context, listen: false).add(
                      titleController.text,
                      artistController.text,
                      genreController.text,
                      releaseYear,
                      dateAcquired,
                      cover,
                    );

                    Navigator.pop(context);
                  }
                },
                child: const Text("Add record", style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
