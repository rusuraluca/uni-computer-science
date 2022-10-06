# Represents a Book instance.

class Book:

    # Constructor

    def __init__(self, title, price, number):
        """
        This is the initializing method or constructor for the class.
        :param title: string representing the title of the book
        :param price: float representing the price of the book
        :param number: int representing the number of books sold
        :return:
        """
        self.__title = title
        self.__price = price
        self.__number = number

    def __eq__(self, other):
        """
        Check if the parameter is equal to the current object.
        :param other: another Book object
        :return: boolean: true if all attributes of the two objects are equal, false otherwise
        """
        return self.__title == other.__title and self.__price == other.__price and self.__number == other.__number

    def __str__(self):
        """
        This function provides the string representation of a Object object.
        :return:
        """
        string = f"Book: {self.__title} || Price: {self.__price} || No. items sold: {self.__number}"
        return string

    # Getters

    def get_title(self):
        """
        Get the title of the book
        :return:
        """
        return self.__title

    def get_price(self):
        """
        Get the price of the book
        :return:
        """
        return self.__price

    def get_number(self):
        """
        Get the number of books sold
        :return:
        """
        return self.__number

    # Setters

    def set_title(self, title):
        """
        Set the title of the book
        :param title: string representing the title of the book
        :return:
        """
        self.__title = title

    def set_price(self, price):
        """
        Set the price of the book
        :param price: float representing the price of the book
        :return:
        """
        self.__price = price

    def set_number(self, number):
        """
        Set the number of books sold
        :param number: int representing the number of the book
        :return:
        """
        self.__number = number
