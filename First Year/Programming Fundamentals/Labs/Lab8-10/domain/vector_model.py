import numpy


class MyVector:
    """
    Represents a vector instance
    """
    def __init__(self, name_id, color, type, values):
        """
        This is the initializing method or constructor for the class.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :param type: type of the vector
        :type type: int (greater or equal to 1)
        :param values: list of numbers representing the values of the vector
        :return:
        """
        if len(name_id) < 1:
            raise IndexError("The name id can not be empty")
        if not isinstance(name_id, str):
            raise AttributeError("The name id of the vector must be a string")

        self.__name_id = name_id

        if len(color) < 1 or len(color) > 1 \
                or not isinstance(color, str) \
                or color.lower() not in {'r', 'g', 'b', 'y', 'm'}:
            raise AttributeError("The color of the vector must be from this list: r, g, b, y or m")

        self.__color = color

        if not isinstance(type, int) or type < 1:
            raise AttributeError("The type of the vector must be a positive integer greater or equal to 1")

        self.__type = type

        if len(values) == 0:
            raise AttributeError("The list of values of the vector can't be empty")
        for value in values:
            if not isinstance(value, int):
                if not isinstance(value, float):
                    raise AttributeError("The values of the vector must be real numbers")

        self.__values = numpy.array(values.copy(), dtype=object)

    def __str__(self):
        """
        This function provides the string representation of a vector.
        :return:
        """
        return f"Vector {self.__name_id} of color {self.__color} and type {self.__type} with values: {self.__values}"

    def __eq__(self, other):
        """
        Check if the parameter is equal to the current object.
        :param other: another MyVector object
        :return: boolean: true if some attributes of the two objects are equal, false otherwise
        """
        return self.__name_id != other.__name_id \
            and self.__color == other.__color and self.__type == other.__type and self.__values == other.__values

    def get_name_id(self):
        """
        Get name_id of the vector.
        :return: name_id of the vector
        :rtype: str
        """
        return self.__name_id

    def set_name_id(self, name_id):
        """
        Set name_id of the vector.
        :param name_id: new value of the name_id
        :type name_id: str
        :return:
        """
        if len(name_id) < 1:
            raise IndexError("The name id can not be empty")
        if not isinstance(name_id, str):
            raise AttributeError("The name id of the vector must be a string")

        self.__name_id = name_id

    def get_color(self):
        """
        Get color of the vector.
        :return: color of the vector
        :rtype: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        """
        return self.__color

    def set_color(self, color):
        """
        Set color of the vector.
        :param color: new value of the color
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :return:
        """
        if len(color) < 1 or len(color) > 1 \
                or not isinstance(color, str) \
                or color.lower() not in {'r', 'g', 'b', 'y', 'm'}:
            raise AttributeError("The color of the vector must be from this list: r, g, b, y or m")

        self.__color = color

    def get_type(self):
        """
        Get type of the vector.
        :return: type of the vector
        :rtype: int (greater or equal to 1)
        """
        return self.__type

    def set_type(self, type):
        """
        Set type of the vector.
        :param type: new value of the type
        :type type: int (greater or equal to 1)
        :return:
        """
        if not isinstance(type, int) or type < 1:
            raise AttributeError("The type of the vector must be a positive integer greater or equal to 1")

        self.__type = type

    def get_values(self):
        """
        Get values of the vector.
        :return: list of numbers representing the values of the vector
        """
        return self.__values.copy()

    def set_values(self, values):
        """
        Set values of the vector.
        :param values: new list of numbers representing the new values of the vector
        :return:
        """
        if len(values) == 0:
            raise AttributeError("The list of values of the vector can't be empty")
        for value in values:
            if not isinstance(value, int):
                if not isinstance(value, float):
                    raise AttributeError("The values of the vector must be real numbers.")
        self.__values = numpy.array(values.copy(), dtype=object)

    def add(self, other):
        """
        Add two vectors.
        param other: another MyVector object
        :return: list of numbers representing the values of the vectors added
        """
        if self.__values.size != other.__values.size:
            raise AttributeError("To add two vectors, they need to have equal numbers of elements")

        adunare = self.__values + other.__values
        return adunare.copy()

    def subtract(self, other):
        """
        Subtract two vectors.
        param other: another MyVector object
        :return: list of numbers representing the values of the vectors subtracted
        """
        if self.__values.size != other.__values.size:
            raise AttributeError("To subtract two vectors, they need to have equal numbers of elements")

        subtraction = self.__values - other.__values
        return subtraction.copy()

    def multiply(self, other):
        """
        Multiply two vectors.
        param other: another MyVector object
        return: number representing the value of the vectors multiplicated
        """
        if self.__values.size != other.__values.size:
            raise AttributeError("To multiply two vectors, they need to have equal numbers of elements")
        mul = self.__values * other.__values
        return sum(mul)

    def add_scalar(self, scalar):
        """
        Add a scalar to a vector.
        :param scalar: a number
        return:
        """
        if not isinstance(scalar, int):
            if not isinstance(scalar, float):
                raise AttributeError("The scalar must be a number")

        self.__values = self.__values + scalar

    def num_of_elements(self):
        """
        Number of elements in a vector.
        return: size of vector list of values
        :rtype: int
        """
        return self.__values.size

    def sum_of_elements(self):
        """
        Sum of elements in a vector.
        return: sum of vector list of values
        :rtype: float
        """
        return sum(self.__values)

    def product_of_elements(self):
        """
        Product of elements in a vector.
        return: product of vector list of values
        :rtype: float
        """
        return numpy.prod(self.__values)

    def average_of_elements(self):
        """
        Average of elements in a vector.
        return: average of vector list of values
        :rtype: float
        """
        return float(numpy.average(self.__values))

    def min_of_elements(self):
        """
        Minimum of a vector.
        return: minimum of vector list of values
        :rtype: float
        """
        return numpy.amin(self.__values)

    def max_of_elements(self):
        """
        Maximum of a vector.
        return: maximum of vector list of values
        :rtype: float
        """
        return numpy.amax(self.__values)
