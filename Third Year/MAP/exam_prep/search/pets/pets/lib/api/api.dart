import 'package:dio/dio.dart';
import '../models/item.dart';
import 'package:logger/logger.dart';

const String baseUrl = 'http://10.0.2.2:2309';

class ApiService {
  static final ApiService instance = ApiService._init();
  static final Dio dio = Dio();
  var logger = Logger();

  ApiService._init();

  Future<List<List<dynamic>>> getPets() async {
    logger.log(Level.info, "getPets() called");
    final response = await dio.get('$baseUrl/pets');
    logger.log(Level.info, "getPets() response: $response");
    if (response.statusCode == 200) {
      return (response.data as List).map((e) => [e['id'], e['name']]).toList();
    } else {
      logger.log(Level.error, "getPets() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<List<Pet>> getPetById(int id) async {
    logger.log(Level.info, "getPetById() called");
    final response = await dio.get('$baseUrl/pet/$id');
    logger.log(Level.info, "getPetById() response: $response");
    if (response.statusCode == 200) {
      final Pet pet = Pet.fromJson(response.data);
      logger.log(Level.info, "getPetById() parsed pet: $pet");
      return [pet];
    } else {
      logger.log(Level.error,
          "getPetById() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<Pet> addPet(Pet pet) async {
    logger.log(Level.info, "addPet() called");
    final response =
        await dio.post('$baseUrl/pet', data: pet.toJsonWithoutId());
    logger.log(Level.info, "addPet() response: $response");
    if (response.statusCode == 200) {
      return Pet.fromJson(response.data);
    } else {
      logger.log(
          Level.error, "addPet() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  void deletePet(int id) async {
    logger.log(Level.info, "deletePet() called");
    final response = await dio.delete('$baseUrl/pet/$id');
    logger.log(Level.info, "deletePet() response: $response");
    if (response.statusCode != 200) {
      logger.log(
          Level.error, "deletePet() error: ${response.statusMessage}");
      throw Exception(response.statusMessage);
    }
  }

  Future<List<Pet>> searchPet(String criteria, String criteriaValue) async {
    logger.log(Level.info, "searchPet() called");
    final response = await dio.get('$baseUrl/search');
    logger.log(Level.info, "searchPet() response: $response");
    try {
      if (response.statusCode == 200) {
        final List<dynamic> jsonList = response.data;
        List<Pet> pets = jsonList.map((json) => Pet.fromJson(json)).toList();

        if (criteria == 'breed') {
          pets = pets.where((pet) => pet.breed == criteriaValue).toList();
        } else if (criteria == 'age') {
          pets = pets.where((pet) => pet.age.toString() == criteriaValue).toList();
        } else if (criteria == 'location') {
          pets = pets.where((pet) => pet.location == criteriaValue).toList();
        } else if (criteria == 'weight') {
          pets = pets.where((pet) => pet.weight.toString() == criteriaValue).toList();
        }

        // Sort pets by weight (descending) and age (ascending)
        pets.sort((a, b) {
          int weightComparison = b.weight.compareTo(a.weight);
          if (weightComparison != 0) {
            return weightComparison;
          } else {
            return a.age.compareTo(b.age);
          }
        });

        return pets;
      } else {
        logger.log(Level.error, "searchPet() error: ${response.statusMessage}");
        throw Exception('Failed to fetch pets: ${response.statusMessage}');
      }
    } catch (error) {
      logger.log(Level.error, "searchPet() error: ${response.statusMessage}");
      throw Exception('Error: $error');
    }
  }
}
