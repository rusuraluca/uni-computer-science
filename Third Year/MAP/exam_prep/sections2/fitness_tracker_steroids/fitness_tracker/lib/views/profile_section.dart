import 'package:flutter/material.dart';
import '../repositories/users.dart';
import '../models/user.dart';

class ProfileSection extends StatefulWidget {
  const ProfileSection({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _ProfileSectionState createState() => _ProfileSectionState();
}

class _ProfileSectionState extends State<ProfileSection> {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(50),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildUserInfoItem('Name', _user.name),
              _buildUserInfoItem('Age', _user.age.toString()),
              _buildUserInfoItem('Height (cm)', _user.height.toString()),
              _buildUserInfoItem('Weight (kg)', _user.weight.toString()),
              const SizedBox(height: 16.0),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserInfoItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Text(value),
        ],
      ),
    );
  }
}
