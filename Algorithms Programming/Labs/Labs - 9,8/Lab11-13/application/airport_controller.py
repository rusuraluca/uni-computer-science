# Controller class to reach the logical/domain layer.
class AirportController:

    # 1st. Iteration
    # CRUD

    def __init__(self, airport):
        """
        Init a controller instance.
        :param airport: an Airport instance
        :return:
        """
        self.__airport = airport

    def __len__(self):
        """
        Overwriting the len() function.
        :return: integer representing the number of planes in the airport
        """
        return len(self.__airport)

    def __str__(self):
        """
        This function provides the string representation of an airport.
        :return: string
        """
        return str(self.__airport)

    def exists_plane(self, name):
        """
        Checks if a plane already exists in the airport.
        :param name: string representing the name/number of the plane
        :return: bool representing True if the given plane is already in the airport, False otherwise
        """
        return self.exists_plane(name)

    def get_plane_of_name(self, name):
        """
        Get a plane of a given name.
        :param name: string representing the name/number of the plane
        :return:
        """
        return self.__airport.get_plane_of_name(name)

    def get_plane_at_index(self, index):
        """
        Get a plane at a given index.
        :param index: integer representing the index of a plane object in the airport's list of planes
        :return: plane at given index
        """
        return self.__airport.get_plane_at_index(index)

    def get_passengers_from_plane(self, name):
        """
        Get the passengers from a plane.
        :param name: string representing the name/number of the plane
        :return:
        """
        return self.__airport.get_passengers_from_plane(name)

    def add_passenger_to_plane(self, name, first_name, last_name, passport_num):
        """
        Add a passenger to a plane.
        :param name: string representing the name/number of the plane
        :param first_name: string representing the first name of the passenger
        :param last_name: string representing the last name of the passenger
        :param passport_num: string representing the passport number of the passenger
        :return:
        """
        return self.__airport.add_passenger_to_plane(name, first_name, last_name, passport_num)

    def update_passenger_in_plane(self, name, curr_passport_num, first_name, last_name, passport_num):
        """
        Update a passenger from a plane in the airport
        :param name: string representing the name/number of the plane
        :param curr_passport_num: string representing the passport number of the passenger
        :param first_name: string representing the new first name of the passenger
        :param last_name: string representing the new last name of the passenger
        :param passport_num: string representing the new passport number of the passenger
        :return:
        """
        return self.__airport.update_passenger_in_plane(name, curr_passport_num, first_name, last_name, passport_num)

    def delete_passenger_in_plane(self, name, passport_num):
        """
        Delete a passenger from a plane in the airport
        :param name: string representing the name/number of the plane
        :param passport_num: string representing the passport number of the passenger
        :return:
        """
        return self.__airport.delete_passenger_in_plane(name, passport_num)

    def add_plane(self, name, airline, seats, destination, passengers_list):
        """
        Add a mew plane in the airport.
        :param name: string representing the name/number of a plane object
        :param airline: string representing the airline company of a plane object
        :param seats: integer representing the number of seats of a plane object
        :param destination: string representing the destination of a plane object
        :param passengers_list: list representing a collection of Passenger instances
        :return:
        """
        return self.__airport.add_plane(name, airline, seats, destination, passengers_list)

    def update_plane(self, index, name, airline, seats, destination, passengers_list):
        """
        Update plane by index.
        :param index: integer representing the index of a plane object in the airport's list of planes
        :param name: string representing the name/number of a plane object
        :param airline: string representing the airline company of a plane object
        :param seats: integer representing the number of seats of a plane object
        :param destination: string representing the destination of a plane object
        :param passengers_list: list representing a collection of Passenger instances
        :return:
        """
        return self.__airport.update_plane(index, name, airline, seats, destination, passengers_list)

    def delete_plane(self, index):
        """
        Delete a plane by index.
        :param index: integer representing the index of a plane object in the airport's list of planes
        :return:
        """
        return self.__airport.delete_plane(index)

    # 2nd. Iteration
    # Sort/Search/Filter

    def sort_passengers_by_last_name(self, name):
        """
        3. Sort the passengers by last name in a plane given by its name
        :param name: string representing the name/number of a plane object
        :return:
        """
        return self.__airport.sort_passengers_by_last_name(name)

    def sort_planes_by_number_of_passengers(self):
        """
        4. Sort planes according to the number of passengers
        :return:
        """
        return self.__airport.sort_planes_by_number_of_passengers()

    def sort_planes_by_passengers_with_name(self, substring):
        """
        5. Sort planes according to the number of passengers with the first name starting
        with a given substring
        :param substring: string representing the substring needed for the sort above
        :return:
        """
        return self.__airport.sort_planes_by_passengers_with_name(substring)

    def sort_planes_by_passengers_and_destination(self):
        """
        6. Sort planes according to the string obtained by concatenation of the number of
        passengers in the plane and the destination
        :return:
        """
        return self.__airport.sort_planes_by_passengers_and_destination()

    def get_planes_with_passengers_with_passport(self, letter1, letter2, letter3):
        """
        7. Identify planes that have passengers with passport numbers starting with the
        same 3 letters
        :param letter1: string representing the first letter with which the passport numbers must start
        :param letter2: string representing the second letter with which the passport numbers must start
        :param letter3:string representing the third letter with which the passport numbers must start
        :return: list of planes
        """
        return self.__airport.get_planes_with_passengers_with_passport(letter1, letter2, letter3)

    def get_plane_passengers_with_string_in_name(self, name, string):
        """
        8. Identify passengers from a given plane for which the first name or last name
        contain a string given as parameter
        :param name: string representing the name/number of a plane object
        :param string: the string that needs to be used
        :return: list of passengers
        """
        return self.__airport.get_plane_passengers_with_string_in_name(name, string)

    def get_planes_with_passenger(self, name):
        """
        9. Identify plane/planes where there is a passenger with given name
        :param name: string representing the name given
        :return: list of planes
        """
        return self.__airport.get_planes_with_passenger(name)

    # 3rd. Iteration
    # Group Generation

    def groups_of_passengers_in_plane_with_different_last_names(self, name, k):
        """
        10. Form groups of k passengers from the same plane but with different last names
        (k is a value given by the user)
        :param name: string representing the name/number of a plane object
        :param k: integer representing the number of objects in a group
        :return: list of groups
        """
        return self.__airport.groups_of_passengers_in_plane_with_different_last_names(name, k)

    def groups_of_planes_with_same_destination_belonging_different_companies(self, k):
        """
        11. Form groups of k planes with the same destination but belonging to different airline companies
        (k is a value given by the user).
        :param k: integer representing the number of objects in a group
        :return: list of groups
        """
        return self.__airport.groups_of_planes_with_same_destination_belonging_different_companies(k)
