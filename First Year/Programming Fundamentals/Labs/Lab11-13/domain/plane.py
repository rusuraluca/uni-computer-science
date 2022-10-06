from domain.passenger import Passenger
from typing import List


# Represents Plane instance that has a collection of Passenger instances.
class Plane:

    # 1st. Iteration
    # Constructor/Getters/Setters
    def __init__(self, name, airline, seats, destination, passengers_list: List[Passenger]):
        """
        This is the initializing method or constructor for the class.
        :param name: string representing the name/number of a plane object
        :param airline: string representing the airline company of a plane object
        :param seats: integer representing the number of seats of a plane object
        :param destination: string representing the destination of a plane object
        :param passengers_list: list representing a collection of Passenger instances
        :return:
        """
        if len(name) == 0:
            raise IndexError("The name of the plane can't be empty")
        self.__name = name

        if len(airline) == 0:
            raise IndexError("The name of the airline company of the plane can't be empty")
        if airline.isdigit():
            raise AttributeError("The airline company of the plane must be a string")
        self.__airline = airline

        if not isinstance(seats, int) or seats < 1:
            raise AttributeError("The number of seats of the plane must be a positive integer greater than 0")
        self.__seats = seats

        if len(destination) == 0:
            raise IndexError("The destination of the plane can't be empty")
        if destination.isdigit():
            raise AttributeError("The destination of the plane must be a string")
        self.__destination = destination

        if len(passengers_list) > self.__seats:
            raise AttributeError("The list of passengers of the plane must be smaller or equal to the number of seats")
        self.__passengers = []
        for passenger in passengers_list:
            if self.exists_passenger(passenger.get_passport_num()):
                raise IndexError(f"A passenger with the passport number {passenger.get_passport_num()} "
                                 f"is already in the plane")
            else:
                self.__passengers.append(passenger)

    def exists_passenger(self, passport_num):
        """
        Checks if a passenger is already in the plane by passport number.
        :param passport_num: string representing the passport number of a passenger
        :return:
        """
        for passenger in self.__passengers:
            if passenger.get_passport_num() == passport_num:
                return True
        return False

    def exists_passenger_by_name(self, name):
        """
        Checks if a passenger is already in the plane by name.
        :param name: string representing the first/last name of a passenger
        :return:
        """
        for passenger in self.__passengers:
            if passenger.get_first_name() == name:
                return True
            if passenger.get_last_name() == name:
                return True
        return False

    def __str__(self):
        """
        This function provides the string representation of a plane.
        :return:
        """
        string = f"Plane: {self.__name} \n"
        string += f"Airline: {self.__airline} \n"
        string += f"Seats: {self.__seats} \n"
        string += f"Destination: {self.__destination} \n"
        string += f"Passengers: \n"
        index = 0
        for passenger in self.__passengers:
            string += f"Id: {index} || "
            string += str(passenger)
            string += "\n"
            index += 1
        return string

    def __eq__(self, other):
        """
        Check if the parameter is equal to the current object.
        :param other: another Plane object
        :return: boolean: true if all attributes of the two objects are equal, false otherwise
        """
        return self.__name == other.__name \
            and self.__airline == other.__airline \
            and self.__seats == other.__seats \
            and self.__destination == other.__destination \
            and self.__passengers == other.__passengers

    def get_name(self):
        """
        Get the name/number of the plane.
        :return: string representing the name/number of a plane object
        """
        return self.__name

    def set_name(self, name):
        """
        Set the name/number of the plane.
        :param name: string representing the name/number of a plane object
        :return:
        """
        if len(name) == 0:
            raise IndexError("The name of the plane can't be empty")
        self.__name = name

    def get_airline(self):
        """
        Get the airline company of the plane.
        :return: string representing the airline company of a plane object
        """
        return self.__airline

    def set_airline(self, airline):
        """
        Set the airline of the plane.
        :param airline: string representing the airline company of a plane object
        :return:
        """
        if len(airline) == 0:
            raise IndexError("The name of the airline company of the plane can't be empty")
        if airline.isdigit():
            raise AttributeError("The airline company of the plane must be a string")
        self.__airline = airline

    def get_seats(self):
        """
        Get the number of seats of the plane.
        :return: integer representing the number of seats of a plane object
        """
        return self.__seats

    def set_seats(self, seats):
        """
        Set the number of seats of the plane.
        :param seats: integer representing the number of seats of a plane object
        :return:
        """
        if not isinstance(seats, int) or seats < 1:
            raise AttributeError("The number of seats of the plane must be a positive integer greater than 0")
        self.__seats = seats

    def get_destination(self):
        """
        Get the destination of the plane.
        :return: string representing the destination of a plane object
        """
        return self.__destination

    def set_destination(self, destination):
        """
        Set the destination of the plane.
        :param destination: string representing the destination of a plane object
        :return:
        """
        if len(destination) == 0:
            raise IndexError("The destination of the plane can't be empty")
        if destination.isdigit():
            raise AttributeError("The destination of the plane must be a string")
        self.__destination = destination

    def get_passengers(self):
        """
        Get the passengers of the plane.
        :return: list representing a collection of Passenger instances
        """
        return self.__passengers.copy()

    def get_passenger_of_index(self, index):
        """
        Get the passenger at a given index in the plane.
        :param index: integer representing the index at which a passenger is seated
        :return: list representing a collection of Passenger instances
        """
        idd = 0
        for passenger in self.__passengers:
            if index == idd:
                return passenger
            idd += 1

    def get_str_passengers(self):
        """
        Get the string representation of the passengers list of the plane.
        :return: string representing the passengers list of the plane
        """
        string = ""
        index = 0
        for passenger in self.__passengers:
            string += f"Id: {index} || "
            string += str(passenger)
            string += "\n"
            index += 1
        return string

    def get_number_of_passengers(self):
        """
        Get the number of passengers in the plane.
        :return: int representing the number of passengers in the plane
        """
        count = 0
        for passenger in self.__passengers:
            count += 1
        return count

    def set_passengers(self, passengers_list):
        """
        Set the passengers of the plane.
        :param passengers_list:
        :return:
        """
        if len(passengers_list) > self.__seats:
            raise AttributeError("The list of passengers of the plane must be smaller or equal to the number of seats")
        self.__passengers = []
        for passenger in passengers_list:
            if self.exists_passenger(passenger.get_passport_num()):
                raise IndexError(f"A passenger with the passport number {passenger.get_passport_num()} "
                                 f"is already in the plane")
            else:
                self.__passengers.append(passenger)

    def add_passenger(self, first_name, last_name, passport_num):
        """
        Add a passenger to the plane.
        :param first_name: string representing the first name of the passenger
        :param last_name: string representing the last name of the passenger
        :param passport_num: string representing the passport number of the passenger
        :return:
        """
        if self.exists_passenger(passport_num):
            raise IndexError(f"The passenger with passport number {passport_num} is already in the plane")

        self.__passengers.append(Passenger(first_name, last_name, passport_num))

    def get_passenger(self, passport_num):
        """
        Get a passenger from the plane.
        :param passport_num: string representing the passport number of a passenger
        :return:
        """
        if not self.exists_passenger(passport_num):
            raise IndexError(f"No passenger with the passport number {passport_num} in the plane")

        for passenger in self.__passengers:
            if passenger.get_passport_num() == passport_num:
                return passenger

    def update_passenger(self, passport_num, new_first_name, new_last_name, new_passport_num):
        """
        Update a passenger from the plane.
        :param passport_num: string representing the passport number of a passenger
        :param new_first_name: string representing the new first name of the passenger
        :param new_last_name: string representing the new last name of the passenger
        :param new_passport_num: string representing the new passport number of the passenger
        :return:
        """
        if not self.exists_passenger(passport_num):
            raise IndexError(f"No passenger with the passport number {passport_num} in the plane")

        for passenger in self.__passengers:
            if passenger.get_passport_num() == passport_num:
                passenger.set_first_name(new_first_name)
                passenger.set_last_name(new_last_name)
                if self.exists_passenger(new_passport_num) and new_passport_num != passport_num:
                    raise IndexError(f"A passenger with the passport number {new_passport_num} "
                                     f"is already in the plane")
                passenger.set_passport_num(new_passport_num)
                return passenger

    def delete_passenger(self, passport_num):
        """
        Delete a passenger from the plane.
        :param passport_num: string representing the passport number of a passenger
        :return:
        """
        if not self.exists_passenger(passport_num):
            raise IndexError(f"No passenger with the passport number {passport_num} in the plane")

        new_passengers = []
        for passenger in self.__passengers:
            if passenger.get_passport_num() != passport_num:
                new_passengers.append(passenger)

        self.__passengers = new_passengers
