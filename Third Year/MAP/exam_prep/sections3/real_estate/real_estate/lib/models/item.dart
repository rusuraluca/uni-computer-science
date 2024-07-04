class FinanceData {
  int? id;
  String date;
  String type;
  double amount;
  String category;
  String description;

  FinanceData({
    this.id,
    required this.date,
    required this.type,
    required this.amount,
    required this.category,
    required this.description,
  });

  factory FinanceData.fromJson(Map<String, dynamic> json) {
    return FinanceData(
      id: json['id'] as int?,
      date: json['date'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      category: json['category'] as String,
      description: json['description'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'type': type,
      'amount': amount,
      'category': category,
      'description': description,
    };
  }

  Map<String, dynamic> toJsonWithoutId() {
    return {
      'date': date,
      'type': type,
      'amount': amount,
      'category': category,
      'description': description,
    };
  }

  FinanceData copy({
    int? id,
    String? date,
    String? type,
    double? amount,
    String? category,
    String? description,
  }) =>
      FinanceData(
        id: id ?? this.id,
        date: date ?? this.date,
        type: type ?? this.type,
        amount: amount ?? this.amount,
        category: category ?? this.category,
        description: description ?? this.description,
      );

  @override
  String toString() {
    return 'FinanceData - date: $date, type: $type, amount: $amount, category: $category, description: $description';
  }
}
