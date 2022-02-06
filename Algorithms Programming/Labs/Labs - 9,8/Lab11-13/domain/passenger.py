# Represents a Passenger instance.
class Passenger:

    # 1st. Iteration
    # Constructor/Getters/Setters

    def __init__(self, first_name, last_name, passport_num):
        """
        This is the initializing method or constructor for the class.
        :param first_name: string representing the first name of a passenger object
        :param last_name: string representing the last name of a passenger object
        :param passport_num: string representing the passport number of a passenger object
        :return:
        """
        if first_name.isnumeric():
            raise AttributeError("The first name of the passenger must be a string")
        if len(first_name) < 1:
            raise IndexError("The first name of the passenger can't be empty")
        self.__first_name = first_name.upper()

        if last_name.isnumeric():
            raise AttributeError("The first name of the passenger must be a string")
        if len(last_name) < 1:
            raise IndexError("The first name of the passenger can't be empty")
        self.__last_name = last_name.upper()

        if len(passport_num) < 1:
            raise IndexError("The passport number of the passenger can't be empty")
        passport_num = passport_num.upper()
        if passport_num[0] != first_name[0] \
                or passport_num[1] != last_name[0] \
                or passport_num[2].isnumeric() is False \
                or passport_num[3].isnumeric() is False \
                or passport_num[4].isnumeric() is False:
            raise AttributeError("The passport number of the passenger "
                                 "must have the initials of the name and other 3 numbers")
        self.__passport_num = passport_num

    def __str__(self):
        """
        This function provides the string representation of a passenger.
        :return:
        """
        string = f"First Name: {self.__first_name} || "
        string += f"Last Name: {self.__last_name} || "
        string += f"Passport number: {self.__passport_num}"
        return string

    def __eq__(self, other):
        """
        Check if the parameter is equal to the current object.
        :param other: another Passenger object
        :return: boolean: true if all attributes of the two objects are equal, false otherwise
        """
        return self.__first_name == other.__first_name \
            and self.__last_name == other.__last_name \
            and self.__passport_num == other.__passport_num

    def get_first_name(self):
        """
        Get the first name of the passenger.
        :return: string representing the first name of a passenger object
        """
        return self.__first_name

    def set_first_name(self, first_name):
        """
        Set the first name of the passenger.
        :param first_name: string representing the first name of a passenger object
        :return:
        """
        if first_name.isnumeric():
            raise AttributeError("The first name of the passenger must be a string")
        if len(first_name) < 1:
            raise IndexError("The first name of the passenger can't be empty")
        self.__first_name = first_name.upper()

    def get_last_name(self):
        """
        Get the last name of the passenger.
        :return: string representing the last name of a passenger object
        """
        return self.__last_name

    def set_last_name(self, last_name):
        """
        Set the last name of the passenger.
        :param last_name: string representing the last name of a passenger object
        :return:
        """
        if last_name.isnumeric():
            raise AttributeError("The first name of the passenger must be a string")
        if len(last_name) < 1:
            raise IndexError("The first name of the passenger can't be empty")
        self.__last_name = last_name.upper()

    def get_passport_num(self):
        """
        Get the passport number of the passenger.
        :return: string representing the last name of a passenger object
        """
        return self.__passport_num

    def set_passport_num(self, passport_num):
        """
        Set the passport number of the passenger.
        :param passport_num: string representing the passport number of a passenger object
        :return:
        """
        if len(passport_num) < 1:
            raise IndexError("The passport number of the passenger can't be empty")
        first_name = self.get_first_name()
        last_name = self.get_last_name()
        passport_num = passport_num.upper()
        if passport_num[0] != first_name[0] \
                or passport_num[1] != last_name[0] \
                or passport_num[2].isnumeric() is False \
                or passport_num[3].isnumeric() is False \
                or passport_num[4].isnumeric() is False:
            raise AttributeError("The passport number of the passenger "
                                 "must have the initials of the name and other 3 numbers")
        self.__passport_num = passport_num
