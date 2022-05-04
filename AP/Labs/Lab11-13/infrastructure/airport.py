from domain.passenger import Passenger
from domain.plane import Plane
from utils.functions import *
from typing import List


# Represents a collection of Plane instances
class Airport:

    # 1st. Iteration
    # CRUD

    def __init__(self, planes_list: List[Plane]):
        """
        This is the initializing method or constructor for the class.
        Creates a new collection with Plane instances.
        :param planes_list: list of planes
        :return:
        """
        if len(planes_list) < 1:
            raise IndexError("No planes in the airport. Add some first")

        self.__planes = []
        for plane in planes_list:
            if self.exists_plane(plane.get_name()):
                raise IndexError(f"A plane named {plane.get_name()} is already in the airport")
            else:
                self.__planes.append(plane)

    def exists_plane(self, name):
        """
        Checks if a plane already exists in the airport.
        :param name: string representing the name/number of the plane
        :return: bool representing True if the given plane is already in the airport, False otherwise
        """
        for plane in self.__planes:
            if plane.get_name() == name:
                return True
        return False

    def __len__(self):
        """
        Overwriting the len() function.
        :return: integer representing the number of planes in the airport
        """
        return len(self.__planes)

    def __str__(self):
        """
        This function provides the string representation of an airport.
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes in the airport. Add some first")

        string = "Airport Planes: \n\n"
        index = 0
        for plane in self.__planes:
            string += f"Id: {index}. \n"
            string += (str(plane))
            string += "\n"
            index += 1
        return string

    def get_plane_of_name(self, name):
        """
        Get a plane of a given name.
        :param name: string representing the name/number of the plane
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif self.exists_plane(name) is False:
            raise IndexError(f"No plane named {name} in the airport")

        for plane in self.__planes:
            if plane.get_name() == name:
                return plane
        return False

    def get_plane_at_index(self, index):
        """
        Get a plane at a given index.
        :param index: integer representing the index of a plane object in the airport's list of planes
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif not isinstance(index, int):
            raise AttributeError("The index must be an integer")
        elif 0 < index > len(self):
            raise IndexError(f"The index must be an integer from [0-{len(self) - 1}]")

        return self.__planes[index]

    def get_passengers_from_plane(self, name):
        """
        Get the passengers from a plane.
        :param name: string representing the name/number of the plane
        :return:
        """
        plane = self.get_plane_of_name(name)

        return plane.get_passengers()

    def get_passenger_from_plane(self, name, passport_num):
        """
        Get a passenger from a plane.
        :param name: string representing the name/number of the plane
        :param passport_num: string representing the passport number of a passenger
        :return:
        """
        plane = self.get_plane_of_name(name)

        return plane.get_passenger(passport_num)

    def add_passenger_to_plane(self, name, first_name, last_name, passport_num):
        """
        Add a passenger to a plane.
        :param name: string representing the name/number of the plane
        :param first_name: string representing the first name of the passenger
        :param last_name: string representing the last name of the passenger
        :param passport_num: string representing the passport number of the passenger
        :return:
        """
        plane = self.get_plane_of_name(name)
        plane.add_passenger(first_name, last_name, passport_num)
        return plane.get_passengers()

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
        plane = self.get_plane_of_name(name)
        plane.update_passenger(curr_passport_num, first_name, last_name, passport_num)
        return plane.get_passenger(passport_num)

    def delete_passenger_in_plane(self, name, passport_num):
        """
        Delete a passenger from a plane in the airport
        :param name: string representing the name/number of the plane
        :param passport_num: string representing the passport number of the passenger
        :return:
        """
        plane = self.get_plane_of_name(name)
        plane.delete_passenger(passport_num)
        return plane.get_passengers()

    def add_plane(self, name, airline, seats, destination, passengers_list: List[Passenger]):
        """
        Add a new plane in the airport.
        :param name: string representing the name/number of a plane object
        :param airline: string representing the airline company of a plane object
        :param seats: integer representing the number of seats of a plane object
        :param destination: string representing the destination of a plane object
        :param passengers_list: list representing a collection of Passenger instances
        :return:
        """
        if self.exists_plane(name):
            raise IndexError(f"A plane named {name} is already in the airport")

        self.__planes.append(Plane(name, airline, seats, destination, passengers_list))

    def update_plane(self, index, name, airline, seats, destination, passengers_list: List[Passenger]):
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
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif not isinstance(index, int):
            raise AttributeError(f"The index must be an integer")
        elif 0 < index > len(self):
            raise IndexError(f"The index must be an integer from [0-{len(self) - 1}]")

        current_name = self.__planes[index].get_name()
        if self.exists_plane(name) and name != current_name:
            raise AssertionError(f"A plane named {name} is already in the airport")

        self.__planes[index].set_name(name)
        self.__planes[index].set_airline(airline)
        self.__planes[index].set_seats(seats)
        self.__planes[index].set_destination(destination)
        self.__planes[index].set_passengers(passengers_list)

    def delete_plane(self, index):
        """
        Delete a plane by index.
        :param index: integer representing the index of a plane object in the airport's list of planes
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif not isinstance(index, int):
            raise AttributeError("The index must be an integer")
        elif 0 < index > len(self):
            raise IndexError(f"The index must be an integer from [0-{len(self) - 1}]")

        del self.__planes[index]

    # 2nd. Iteration
    # Sort/Search/Filter

    def sort_passengers_by_last_name(self, name):
        """
        3. Sort the passengers by last name in a plane given by its name
        :param name: string representing the name/number of a plane object
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif not isinstance(name, str):
            raise AttributeError(f"The name/number of a plane must be a string")
        elif not self.exists_plane(name):
            raise AssertionError(f"No plane named {name} in the airport")

        plane = self.get_plane_of_name(name)
        passengers = sort(plane.get_passengers(), lambda x, y: x.get_last_name() > y.get_last_name())
        self.get_plane_of_name(name).set_passengers(passengers)
        return plane

    def sort_planes_by_number_of_passengers(self):
        """
        4. Sort planes according to the number of passengers
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")

        planes = sort(self.__planes, lambda x, y: x.get_number_of_passengers() < y.get_number_of_passengers())

        self.__planes = planes

    def sort_planes_by_passengers_with_name(self, substring):
        """
        5. Sort planes according to the number of passengers with the first name starting
        with a given substring
        :param substring: string representing the substring needed for the sort above
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")

        def get_passengers_with_name(passengers, sub_string):
            count = 0
            for passenger in passengers:
                if passenger.get_first_name().startswith(sub_string):
                    count += 1
            return count

        planes = sort(self.__planes, lambda x, y: get_passengers_with_name(x.get_passengers(), substring) <
                                                  get_passengers_with_name(y.get_passengers(), substring))
        self.__planes = planes

    def sort_planes_by_passengers_and_destination(self):
        """
        6. Sort planes according to the string obtained by concatenation of the number of
        passengers in the plane and the destination
        :return:
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")

        def get_string(passengers, destination):
            string = ""
            string += f"{passengers}"
            string += f"{destination}"
            return string

        planes = sort(self.__planes, lambda x, y: get_string(x.get_number_of_passengers(), x.get_destination()) <
                                                  get_string(y.get_number_of_passengers(), y.get_destination()))
        self.__planes = planes

    def get_planes_with_passengers_with_passport(self, letter1, letter2, letter3):
        """
        7. Identify planes that have passengers with passport numbers starting with the
        same 3 letters
        :param letter1: string representing the first letter with which the passport numbers must start
        :param letter2: string representing the second letter with which the passport numbers must start
        :param letter3:string representing the third letter with which the passport numbers must start
        :return: list of planes
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")

        def starts_with_letters(passengers, letter1, letter2, letter3):
            for passenger in passengers:
                string = passenger.get_passport_num()
                if string[0] == letter1.upper() and string[1] == letter2.upper() and string[2] == letter3.upper():
                    return True
            return False

        planes = search(self.__planes, lambda x: starts_with_letters(x.get_passengers(), letter1, letter2, letter3))

        if len(planes) == 0:
            raise IndexError("No plane/planes that have passengers with passport numbers "
                             "starting with the same 3 letters")
        return planes

    def get_plane_passengers_with_string_in_name(self, name, string):
        """
        8. Identify passengers from a given plane for which the first name or last name
        contain a string given as parameter
        :param name: string representing the name/number of a plane object
        :param string: the string that needs to be used
        :return: list of passengers
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif not isinstance(name, str):
            raise AttributeError(f"The name/number of a plane must be a string")
        elif not self.exists_plane(name):
            raise AssertionError(f"No plane named {name} in the airport")
        elif len(string) == 0:
            raise AttributeError("The string must have at least one letter")
        elif not isinstance(string, str):
            raise AttributeError(f"The parameter must be a string")

        def contains_string(passenger, string):
            if string.upper() in passenger.get_first_name() or string.upper() in passenger.get_last_name():
                return True
            return False

        plane = self.get_plane_of_name(name)
        passengers_list = search(plane.get_passengers(), lambda x: contains_string(x, string))

        if len(passengers_list) == 0:
            raise IndexError("No passengers in the given plane for which the first name or last name "
                             "contains a string given as parameter")
        return passengers_list

    def get_planes_with_passenger(self, name):
        """
        9. Identify plane/planes where there is a passenger with given name
        :param name: string representing the name given
        :return: list of planes
        """
        if len(self) == 0:
            raise IndexError("No planes today. Add some first")
        elif len(name) == 0:
            raise AttributeError("The name must have at least one letter")
        elif not isinstance(name, str):
            raise AttributeError(f"The name must be a string")

        planes = search(self.__planes, lambda x: x.exists_passenger_by_name(name.upper()))

        if len(planes) == 0:
            raise IndexError("No plane/planes where there is a passenger with given name")
        return planes

    # 3rd. Iteration
    # Group Generation

    def construct_solution(self, sol, list):
        aux = []
        for i in sol:
            aux.append(list[i])
        return aux

    def groups_of_passengers_in_plane_with_different_last_names(self, name, k):
        """
        10. Form groups of k passengers from the same plane but with different last names
        (k is a value given by the user)
        :param name: string representing the name/number of a plane object
        :param k: integer representing the number of objects in a group
        :return: list of groups
        """
        def constrain(sol, list):
            """
            Checks if they have different name.
            """
            for i in range(len(sol) - 1):
                if list[sol[i]].get_first_name() == list[sol[len(sol) - 1]].get_first_name():
                    if list[sol[i]].get_last_name() == list[sol[len(sol) - 1]].get_last_name():
                        return False
            return True

        if len(self) == 0:
            raise IndexError("No planes today. Add some first")

        plane = self.get_plane_of_name(name).get_passengers()
        param = [k]
        constraints = [constrain]
        aux = []
        for element in backtracking(param, plane, constraints):
            aux.append(self.construct_solution(element, plane))

        if len(aux) == 0:
            raise IndexError("This plane doesnt have valid passengers for forming groups")

        return aux

    def groups_of_planes_with_same_destination_belonging_different_companies(self, k):
        """
        11. Form groups of k planes with the same destination but belonging to different airline companies
        (k is a value given by the user).
        :param k: integer representing the number of objects in a group
        :return: list of groups
        """
        def constrain1(sol, planes):
            """
            Checks if all planes have the same destination.
            """
            for i in range(len(sol) - 1):
                if planes[sol[i]].get_destination() != planes[sol[len(sol) - 1]].get_destination():
                    return False
            return True

        def constrain2(sol, planes):
            """
            Checks if all planes belong to different airline companies.
            """
            for i in range(len(sol) - 1):
                if planes[sol[i]].get_airline() == planes[sol[len(sol) - 1]].get_airline():
                    return False
            return True

        if len(self) == 0:
            raise IndexError("No planes today. Add some first")

        planes = self.__planes
        param = [k]
        constraints = [constrain1, constrain2]
        aux = []
        for element in backtracking(param, planes, constraints):
            aux.append(self.construct_solution(element, planes))

        if len(aux) == 0:
            raise IndexError("This airport doesn't have valid airplanes for forming groups")

        return aux
