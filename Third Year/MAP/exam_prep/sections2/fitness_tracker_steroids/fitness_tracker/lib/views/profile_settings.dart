import 'package:flutter/material.dart';
import '../repositories/users.dart';
import '../models/user.dart';
import '../widgets/message.dart';

class ProfileSettings extends StatefulWidget {
  const ProfileSettings({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _ProfileSettingsState createState() => _ProfileSettingsState();
}

class _ProfileSettingsState extends State<ProfileSettings> {
  final _formKey = GlobalKey<FormState>();
  late User _user;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await UserStorage.loadUser();
    setState(() {
      _user = user;
    });
  }

  Future<void> _saveUser() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      await UserStorage.saveUser(_user);
      // ignore: use_build_context_synchronously
      message(context, 'Personal details updated.', 'Info');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(25),
          children: [
            TextFormField(
              initialValue: _user.name,
              decoration: const InputDecoration(labelText: 'Name'),
              onSaved: (value) => _user.name = value!,
            ),
            TextFormField(
              initialValue: _user.age.toString(),
              decoration: const InputDecoration(labelText: 'Age'),
              keyboardType: TextInputType.number,
              onSaved: (value) => _user.age = int.parse(value!),
            ),
            TextFormField(
              initialValue: _user.height.toString(),
              decoration: const InputDecoration(labelText: 'Height (cm)'),
              keyboardType: TextInputType.number,
              onSaved: (value) => _user.height = double.parse(value!),
            ),
            TextFormField(
              initialValue: _user.weight.toString(),
              decoration: const InputDecoration(labelText: 'Weight (kg)'),
              keyboardType: TextInputType.number,
              onSaved: (value) => _user.weight = double.parse(value!),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: _saveUser,
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}
