class Item {
  int? id;
  String name;
  String description;
  String image;
  String category;
  int units;
  double price;

  Item({
    this.id,
    required this.name,
    required this.description,
    required this.image,
    required this.category,
    required this.units,
    required this.price,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
        id: json['id'] as int?,
        name: json['name'] as String,
        description: json['description'] as String,
        image: json['image'] as String,
        category: json['category'] as String,
        units: json['units'] as int,
        price: json['price'].toDouble());
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'image': image,
      'category': category,
      'units': units,
      'price': price
    };
  }

  Map<String, dynamic> toJsonWithoutId() {
    return {
      'name': name,
      'description': description,
      'image': image,
      'category': category,
      'units': units,
      'price': price
    };
  }

  Item copy({
    int? id,
    String? name,
    String? description,
    String? image,
    String? category,
    int? units,
    double? price,
  }) {
    return Item(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      image: image ?? this.image,
      category: category ?? this.category,
      units: units ?? this.units,
      price: price ?? this.price,
    );
  }

  @override
  String toString() {
    return 'Item with name: $name, description: $description, image: $image, category: $category, units: $units, price: $price';
  }
}
