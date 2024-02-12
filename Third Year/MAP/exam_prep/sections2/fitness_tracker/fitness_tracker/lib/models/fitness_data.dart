class FintessData {
  int? id;
  String date;
  String type;
  int duration;
  int? distance;
  int calories;
  int? rate;

  FintessData({
    this.id,
    required this.date,
    required this.type,
    required this.duration,
    this.distance,
    required this.calories,
    this.rate,
  });

  factory FintessData.fromJson(Map<String, dynamic> json) {
    return FintessData(
      id: json['id'] as int?,
      date: json['date'] as String,
      type: json['type'] as String,
      duration: json['duration'] as int,
      distance: json['distance'] as int?,
      calories: json['calories'] as int,
      rate: json['rate'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'type': type,
      'duration': duration,
      'distance': distance,
      'calories': calories,
      'rate': rate,
    };
  }

  Map<String, dynamic> toJsonWithoutId() {
    return {
      'date': date,
      'type': type,
      'duration': duration,
      'distance': distance,
      'calories': calories,
      'rate': rate,
    };
  }

  FintessData copy({
    int? id,
    String? date,
    String? type,
    int? duration,
    int? distance,
    int? calories,
    int? rate,
  }) =>
      FintessData(
        id: id ?? this.id,
        date: date ?? this.date,
        type: type ?? this.type,
        duration: duration ?? this.duration,
        distance: distance ?? this.distance,
        calories: calories ?? this.calories,
        rate: rate ?? this.rate,
      );

  @override
  String toString() {
    return 'FintessData - date: $date, type: $type, duration: $duration, distance: $distance, calories: $calories, rate: $rate';
  }
}
