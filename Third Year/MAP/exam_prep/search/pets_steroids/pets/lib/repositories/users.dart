import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class UserStorage {
  static const String _nameKey = 'name';
  static const String _ageKey = 'age';
  static const String _heightKey = 'height';
  static const String _weightKey = 'weight';

  static Future<void> saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString(_nameKey, user.name);
    prefs.setInt(_ageKey, user.age);
    prefs.setDouble(_heightKey, user.height);
    prefs.setDouble(_weightKey, user.weight);
  }

  static Future<User> loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final name = prefs.getString(_nameKey) ?? '';
    final age = prefs.getInt(_ageKey) ?? 0;
    final height = prefs.getDouble(_heightKey) ?? 0.0;
    final weight = prefs.getDouble(_weightKey) ?? 0.0;

    return User(name: name, age: age, height: height, weight: weight);
  }
}
