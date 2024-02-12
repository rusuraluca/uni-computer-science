// TODO: CHANGE HERE
class Item {
  int? id;
  String name;
  String type;
  int calories;
  String date;
  String notes;

  Item({
    this.id,
    required this.name,
    required this.type,
    required this.calories,
    required this.date,
    required this.notes,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      id: json['id'] as int?,
      name: json['name'] as String,
      type: json['type'] as String,
      calories: json['calories'] as int,
      date: json['date'] as String,
      notes: json['notes'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'calories': calories,
      'date': date,
      'notes': notes,
    };
  }

  Map<String, dynamic> toJsonWithoutId() {
    return {
      'name': name,
      'type': type,
      'calories': calories,
      'date': date,
      'notes': notes,
    };
  }

  Item copy({
    int? id,
    String? name,
    String? type,
    int? calories,
    String? date,
    String? notes,
  }) =>
      Item(
        id: id ?? this.id,
        name: name ?? this.name,
        type: type ?? this.type,
        calories: calories ?? this.calories,
        date: date ?? this.date,
        notes: notes ?? this.notes,
      );

  @override
  String toString() {
    return 'Item - name: $name, type: $type, calories: $calories, date: $date, notes: $notes';
  }
}
