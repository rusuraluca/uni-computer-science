import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../providers/record_provider.dart';
import '../../models/record.dart';

class EditRecordScreen extends StatefulWidget {
  final Record record;

  const EditRecordScreen({Key? key, required this.record}) : super(key: key);

  @override
  State<EditRecordScreen> createState() => _EditRecordScreenState();
}

class _EditRecordScreenState extends State<EditRecordScreen> {
  String? _artistError;
  String? _titleError;
  String? _genreError;
  String? _releaseYearError;
  String? _dateAcquiredError;

  bool _checkFields(RecordProvider provider) {
    bool error = false;
    if (provider.titleController.text.isEmpty) {
      setState(() {
        _titleError = 'Title cannot be empty';
      });
      error = true;
    }
    if (provider.artistController.text.isEmpty) {
      setState(() {
        _artistError = 'Artist cannot be empty';
      });
      error = true;
    }
    if (provider.genreController.text.isEmpty) {
      setState(() {
        _genreError = 'Genre cannot be empty';
      });
      error = true;
    }
    if (provider.releaseYearController.text.isEmpty) {
      setState(() {
        _releaseYearError = 'Release year cannot be empty';
      });
      error = true;
    } else {
      int year = 1;
      try {
        year = int.parse(provider.releaseYearController.text);
      } catch (e) {
        setState(() {
          _releaseYearError = 'Release year can only be a number';
        });
        error = true;
      }
      if (year < 1900 || year > DateTime.now().year) {
        setState(() {
          _releaseYearError =
              'Release year must be between 1900 and ${DateTime.now().year}';
        });
        error = true;
      }
    }
    if (provider.dateAcquiredController.text.isEmpty) {
      setState(() {
        _dateAcquiredError = 'Date acquired cannot be empty';
      });
      error = true;
    }
    return error;
  }

  void _showValidationSnackBar(
      BuildContext context, String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: color,
    ));
  }

  Future<void> pickCover(BuildContext context, ImageSource source) async {
    try {
      final image = await ImagePicker().pickImage(source: source);
      if (image == null) return;
      // ignore: use_build_context_synchronously
      Provider.of<RecordProvider>(context, listen: false).cover = File(image.path);
      setState(() {});
    } catch (e) {
      // ignore: use_build_context_synchronously
      _showValidationSnackBar(context, 'Error picking image', Colors.red);
    }
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    TextInputType? keyboardType,
    VoidCallback? onTap,
    String? error,
    VoidCallback? onChanged,
  }) {
    return Column(
      children: [
        const SizedBox(height: 10),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            labelText: label,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            errorText: error,
          ),
          onTap: onTap,
          onChanged: (value) {
            onChanged?.call();
          },
        ),
      ],
    );
  }

  void _updateRecord(BuildContext context, RecordProvider provider) {
    try {
      if (!_checkFields(provider)) {
        widget.record.artist = provider.artistController.text;
        widget.record.title = provider.titleController.text;
        widget.record.genre = provider.genreController.text;
        widget.record.releaseYear =
            int.parse(provider.releaseYearController.text);
        widget.record.dateAcquired =
            DateTime.parse(provider.dateAcquiredController.text.split(' ')[0]);
        widget.record.cover = provider.cover;
        provider.updateRecord(widget.record);
        provider.titleController.clear();
        provider.artistController.clear();
        provider.genreController.clear();
        provider.releaseYearController.clear();
        provider.dateAcquiredController.clear();
        provider.cover = null;
        Navigator.of(context).pop();
      }
    } catch (e) {
      _showValidationSnackBar(context, 'Error updating record', Colors.red);
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final provider = Provider.of<RecordProvider>(context, listen: false);
        provider.titleController.clear();
        provider.artistController.clear();
        provider.genreController.clear();
        provider.releaseYearController.clear();
        provider.dateAcquiredController.clear();
        provider.cover = null;
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title:
              const Text('Edit Record', style: TextStyle(color: Colors.black)),
          backgroundColor: Colors.white,
          iconTheme: const IconThemeData(
              color: Colors.black),
        ),
        body: Consumer<RecordProvider>(
          builder: (context, provider, child) => SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.all(30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTextField(
                    label: 'Title',
                    controller: provider.titleController,
                    error: _titleError,
                    onChanged: () => setState(() {
                      _titleError = null;
                    }),
                  ),
                  _buildTextField(
                    label: 'Artist',
                    controller: provider.artistController,
                    error: _artistError,
                    onChanged: () => setState(() {
                      _artistError = null;
                    }),
                  ),
                  _buildTextField(
                    label: 'Genre',
                    controller: provider.genreController,
                    error: _genreError,
                    onChanged: () => setState(() {
                      _genreError = null;
                    }),
                  ),
                  _buildTextField(
                    label: 'Release Year',
                    controller: provider.releaseYearController,
                    keyboardType: TextInputType.number,
                    error: _releaseYearError,
                    onChanged: () => setState(() {
                      _releaseYearError = null;
                    }),
                  ),
                  _buildTextField(
                    label: 'Date Acquired',
                    controller: provider.dateAcquiredController,
                    onTap: () async {
                      setState(() {
                        _dateAcquiredError = null;
                      });

                      DateTime? pickedDate = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime.now(),
                      );

                      if (pickedDate != null) {
                        provider.dateAcquiredController.text =
                            pickedDate.toLocal().toString().split(' ')[0];
                      }
                    },
                    error: _dateAcquiredError,
                    onChanged: () => setState(() {
                      _dateAcquiredError = null;
                    }),
                  ),
                  const SizedBox(height: 10),
                  Visibility(
                    visible: provider.cover != null,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        provider.cover != null
                            ? Image.file(
                                provider.cover!,
                                width: 100,
                                height: 100,
                              )
                            : Container(),
                        ElevatedButton(
                          onPressed: () {
                            provider.cover = null;
                            setState(() {});
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.cancel, color: Colors.white),
                              SizedBox(width: 10),
                              Text('Remove image',
                                  style: TextStyle(color: Colors.white)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => pickCover(context, ImageSource.gallery),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.image_outlined, color: Colors.grey),
                        SizedBox(width: 10),
                        Center(
                          child: Text('Add image',
                              style: TextStyle(color: Colors.grey)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      _updateRecord(context, provider);
                    },
                    child: const Center(child: Text('Save Changes')),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
