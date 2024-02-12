// TODO: CHANGE HERE
class Item {
  int? id;
  String name;
  String breed;
  int age;
  int weight;
  String owner;
  String location;
  String description;

  Item({
    this.id,
    required this.name,
    required this.breed,
    required this.age,
    required this.weight,
    required this.owner,
    required this.location,
    required this.description
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      id: json['id'] as int?,
      name: json['name'] as String,
      breed: json['breed'] as String,
      age: json['age'] as int,
      weight: json['weight'] as int,
      owner: json['owner'] as String,
      location: json['location'] as String,
      description: json['description'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'breed': breed,
      'age': age,
      'weight': weight,
      'owner': owner,
      'location': location,
      'description': description,
    };
  }

  Map<String, dynamic> toJsonWithoutId() {
    return {
      'name': name,
      'breed': breed,
      'age': age,
      'weight': weight,
      'owner': owner,
      'location': location,
      'description': description,
    };
  }

  Item copy({
    int? id,
    String? name,
    String? breed,
    int? age,
    int? weight,
    String? owner,
    String? location,
    String? description,
  }) =>
      Item(
        id: id ?? this.id,
        name: name ?? this.name,
        breed: breed ?? this.breed,
        age: age ?? this.age,
        weight: weight ?? this.weight,
        owner: owner ?? this.owner,
        location: location ?? this.location,
        description: description ?? this.description,
      );
  @override
  String toString() {
    return 'Item - name: $name, breed: $breed, age: $age, weight: $weight, owner: $owner, location: $location, description: $description';
  }
}
