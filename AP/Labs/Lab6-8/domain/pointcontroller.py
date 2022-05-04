from matplotlib.colors import is_color_like


class MyPoint:
    def __init__(self, init_x, init_y, init_col):
        """
        This is the initializing method or constructor for the class
        :param init_x: int representing the x coordinate of a point
        :param init_y: int representing the y coordinate of a point
        :param init_col: string representing a color of a point
        :return:
        """
        if type(init_x) == int:
            if type(init_y) == int:
                if is_color_like(init_col) and init_col.isdigit() is False:
                    self.x = init_x
                    self.y = init_y
                    self.col = init_col
                else:
                    raise ValueError("The color of the point must be a string representing a color!\n")
            else:
                raise ValueError("The y coordinate must be a number!\n")
        else:
            raise ValueError("The x coordinate must be a number!\n")

    def __eq__(self, other):
        """
        Check if the parameter is equal to the current object.
        :param other: another Student object
        :return: boolean: true if the attributes of the two object are equal, false otherwise
        """
        return self.x == other.x and self.y == other.y and self.col == other.col

    def __str__(self):
        """
        This function provides the string representation of a point
        :return:
        """
        return f"Point ({self.x}, {self.y}) of color {self.col}"

    def set_x(self, init_x):
        """
        Set the value of the x coordinate of a point
        :param init_x: int representing the x coordinate of a point
        :return:
        """
        if type(init_x) == int:
            self.x = init_x
        else:
            raise ValueError("The x coordinate must be a number!\n")

    def set_y(self, init_y):
        """
        Set the value of the y coordinate of a point
        :param init_y: int representing the y coordinate of a point
        :return:
        """
        if type(init_y) == int:
            self.y = init_y
        else:
            raise ValueError("The y coordinate must be a number!\n")

    def set_col(self, init_col):
        """
        Set the value of the color of a point
        :param init_col: string representing a color of a point
        :return:
        """
        if is_color_like(init_col) and init_col.isdigit() is False:
            self.col = init_col
        else:
            raise ValueError("The color of the point must be a string representing a color!\n")

    def get_x(self):
        """
        Get the value of the x coordinate of a point
        :return:
        """
        return self.x

    def get_y(self):
        """
        Get the value of the y coordinate of a point
        :return:
        """
        return self.y

    def get_col(self):
        """
        Get the value of the color of a point
        :return:
        """
        return self.col
