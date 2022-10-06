from domain.pointcontroller import MyPoint
from matplotlib.colors import is_color_like
import matplotlib.pyplot as plt


class PointRepository:
    def __init__(self, points_list=[]):
        """
        This is the initializing method or constructor for the class PointRepository
        :param points_list: a list of points
        :return:
        """
        self.points = points_list.copy()

    def __str__(self):
        """
        A string conversion of a PointRepository object
        :return:
        """
        repr_str = ''
        i = 0
        for point in self.points:
            repr_str += 'Index ' + str(i) + ' : ' + str(point) + '\n'
            i += 1
        return repr_str

    def __eq__(self, other):
        """
        Check if the parameter is equal to the current object.
        :param other: another PointRepository object
        :return: boolean: true if the attributes of the two object are equal, false otherwise
        """
        equal = True
        if len(self.points) != len(other.points):
            return False
        else:
            for index in range(len(self.points)):
                equal &= self.points[index] == other.points[index]
            return equal

    def get_number_of_points(self):
        """
        Function to get the length of the infrastructure of points
        :return:
        """
        length = len(self.points)
        return length

    def add_point(self, new_entry: list):
        """
        ex. 1
        Add a point to the infrastructure
        :param new_entry: a list representing the elements of a new point (x coordinate, y coordinate, color)
        :return:
        """
        if type(new_entry[0]) == int:
            if type(new_entry[1]) == int:
                if is_color_like(new_entry[2]) and new_entry[2].isdigit() is False:
                    new_point = MyPoint(new_entry[0], new_entry[1], new_entry[2])
                    ok = True
                    for point in self.points:
                        if point == new_point:
                            ok = False
                    if ok:
                        self.points.append(MyPoint(new_entry[0], new_entry[1], new_entry[2]))
                    else:
                        raise ValueError("This point is already in the infrastructure!\n")
                else:
                    raise ValueError("The color of the point must be a string representing a color!\n")
            else:
                raise ValueError("The y coordinate must be a number!\n")
        else:
            raise ValueError("The x coordinate must be a number!\n")

    def get_all_points(self):
        """
        ex. 2
        Get all points
        :return: the infrastructure of points
        """
        if self.get_number_of_points() > 0:
            repository = PointRepository(self.points)
            return repository
        else:
            return ValueError("There are no points in the infrastructure! Add some first:)\n")

    def get_point_at_index(self, index):
        """
        ex. 3
        Get a point at a given index
        :param index: an integer representing the index of the required point
        :return: the point at the given index
        """
        if type(index) == int:
            if self.get_number_of_points() > 0:
                if 0 <= int(index) < self.get_number_of_points():
                    point = self.points[int(index)]
                    return point
                else:
                    raise ValueError(f"The index must be between [0-{self.get_number_of_points()-1}]!\n")
            else:
                return ValueError("There are no points in the infrastructure! Add some first:)\n")
        else:
            raise ValueError("The index must be a number!\n")

    def get_points_of_color(self, color):
        """
        ex. 4
        Get all points of a given color
        :param color: a string representing the color of the required points
        :return: the point at the given color
        """
        if self.get_number_of_points() > 0:
            list_points_of_color = PointRepository()
            if is_color_like(color) and color.isdigit() is False:
                for point in self.points:
                    if MyPoint.get_col(point) == color:
                        list_points_of_color.add_point([
                            MyPoint.get_x(point),
                            MyPoint.get_y(point),
                            MyPoint.get_col(point)
                        ])
                if list_points_of_color.get_number_of_points() == 0:
                    raise ValueError("The color doesn't represent any point!\n")
                else:
                    return list_points_of_color
            else:
                raise ValueError("The color of the point must be a string representing a color!\n")
        else:
            return ValueError(f"There are {self.get_number_of_points()} points in the infrastructure. Add some first!\n")

    def get_minimum_distance_two_points(self):
        """
        ex. 6
        Get the minimum distance between two points
        :return:
        """
        if self.get_number_of_points() > 1:
            coord_list = []
            for point in self.points:
                coord = []
                coord.append(MyPoint.get_x(point))
                coord.append(MyPoint.get_y(point))
                coord_list.append(coord)
            distances = []
            for i in range(len(coord_list)-1):
                for j in range(i+1, len(coord_list)):
                    distance = pow(pow(coord_list[i][0] - coord_list[j][0], 2) +
                                   pow(coord_list[i][1] - coord_list[j][1], 2), .5)
                    distances.append(distance)

            return f"The minimum distance between two points in the infrastructure is {min(distances)}\n"
        else:
            return ValueError(f"There are {self.get_number_of_points()} "
                              f"points in the infrastructure. You need at least 2. Add some first!\n")

    def update_point_at_index(self, index, new_x, new_y, new_col):
        """
        ex. 7
        Update a point by index
        :param index: an integer representing the index of the point we want to update
        :param new_x: int representing the x coordinate of the point
        :param new_y: int representing the y coordinate of the point
        :param new_col: string representing a color of the point
        :return:
        """
        if type(index) == int:
            if self.get_number_of_points() > index:
                if self.get_point_at_index(index):
                    if type(new_x) == int:
                        if type(new_y) == int:
                            if is_color_like(new_col) and new_col.isdigit() is False:
                                new_point = MyPoint(new_x, new_y, new_col)
                                ok = True
                                for point in self.points:
                                    if point == new_point:
                                        ok = False
                                if ok:
                                    MyPoint.set_x(self.points[index], new_x)
                                    MyPoint.set_y(self.points[index], new_y)
                                    MyPoint.set_col(self.points[index], new_col)
                                else:
                                    raise ValueError("This point is already in the infrastructure! Try again!\n")
                            else:
                                raise ValueError("The color of the point must be a string representing a color!\n")
                        else:
                            raise ValueError("The y coordinate must be a number!\n")
                    else:
                        raise ValueError("The x coordinate must be a number!\n")
                else:
                    raise ValueError(f"The index must be between [0-{self.get_number_of_points()-1}]!\n")
            else:
                return ValueError("There are no points in the infrastructure. Add some first :)\n")
        else:
            raise ValueError("The index must be a number!\n")

    def delete_point_at_index(self, index):
        """
        ex. 8
        Delete a point by index
        :param index: an integer representing the index of the point we want to delete
        :return:
        """
        if type(index) == int:
            if self.get_number_of_points() > 0:
                if 0 <= index < self.get_number_of_points():
                    copy = self.points[index]
                    del self.points[index]
                    return copy
                else:
                    raise ValueError(f"The index must be between [0-{self.get_number_of_points()-1}]!\n")
            else:
                return ValueError("There are no points in the infrastructure. Add some first :)\n")
        else:
            raise ValueError("The index must be a number!\n")

    def get_points_inside_square(self, up_left: list, length):
        """
        ex. 5
        Get all points that are inside a given square (up-left corner and length given)
        :param up_left: a list with the x and y coordinate of the up-left corner of the square
        :param length: an integer representing the length of the square
        :return:
        """
        if self.get_number_of_points() > 0:
            list_points_inside_square = PointRepository()
            if type(up_left[0]) == int:
                if type(up_left[1]) == int:
                    if type(length) == int and 0 < length:
                        for point in self.points:
                            if MyPoint.get_x(point) > up_left[0] and MyPoint.get_y(point) > up_left[1]:
                                if MyPoint.get_x(point) < (up_left[0] + length) \
                                        and MyPoint.get_y(point) < (up_left[1] + length):
                                    list_points_inside_square.add_point([
                                        MyPoint.get_x(point),
                                        MyPoint.get_y(point),
                                        MyPoint.get_col(point)
                                    ])
                        if list_points_inside_square.get_number_of_points() == 0:
                            return ValueError("There are no points in the given square!\n")
                        else:
                            return list_points_inside_square
                    else:
                        raise ValueError("The length must be a positive number greater than 0!\n")
                else:
                    raise ValueError("The y coordinate must be a number!\n")
            else:
                raise ValueError("The x coordinate must be a number!\n")
        else:
            return ValueError(f"There are {self.get_number_of_points()} points in the infrastructure. Add some first!\n")

    def delete_points_inside_square(self, up_left: list, length):
        """
        ex. 9
        Delete all points that are inside a given square
        :param up_left: a list with the x and y coordinate of the up-left corner of the square
        :param length: an integer representing the length of the square
        :return:
        """
        if self.get_number_of_points() > 0:
            list_points_inside_square = PointRepository()
            list_points_to_delete = []

            if type(up_left[0]) == int:
                if type(up_left[1]) == int:
                    if type(length) == int and 0 < length:
                        for point in self.points:
                            if MyPoint.get_x(point) > up_left[0] and MyPoint.get_y(point) > up_left[1]:
                                if MyPoint.get_x(point) < (up_left[0] + length) \
                                        and MyPoint.get_y(point) < (up_left[1] + length):
                                    list_points_inside_square.add_point([
                                        MyPoint.get_x(point),
                                        MyPoint.get_y(point),
                                        MyPoint.get_col(point)
                                    ])
                                    list_points_to_delete.append(MyPoint(
                                                MyPoint.get_x(point),
                                                MyPoint.get_y(point),
                                                MyPoint.get_col(point)
                                    ))
                        for point in list_points_to_delete:
                            self.points.remove(point)
                        if list_points_inside_square.get_number_of_points() == 0:
                            return ValueError("There are no points in the given square!\n")
                        else:
                            repr_str = 'Points deleted:\n'
                            repr_str += str(list_points_inside_square) + '\n'
                            repr_str += 'Now the infrastructure is:\n'
                            repr_str += str(self.get_all_points()) + '\n'
                            return repr_str
                    else:
                        raise ValueError("The length must be a positive number greater than 0!\n")
                else:
                    raise ValueError("The y coordinate must be a number!\n")
            else:
                raise ValueError("The x coordinate must be a number!\n")
        else:
            return ValueError(f"There are {self.get_number_of_points()} points in the infrastructure. Add some first!\n")

    def plot_points_in_chart(self):
        """
        ex. 10
        Plot all points in a chart (using library matplotlib)
        :return:
        """
        if self.get_number_of_points() > 0:
            x = []
            y = []
            col = []
            for point in self.points:
                x.append(MyPoint.get_x(point))
                y.append(MyPoint.get_y(point))
                col.append(MyPoint.get_col(point))

            plt.scatter(x, y, c=col)
            plt.show()
            return "The point infrastructure is in the chart above: \n"
        else:
            return ValueError("There are no points in the infrastructure. Add some first :)\n")

    def get_maximum_distance_two_points(self):
        """
        ex. 13
        Get the maximum distance between two points
        :return:
        """
        if self.get_number_of_points() > 1:
            coord_list = []
            for point in self.points:
                coord = []
                coord.append(MyPoint.get_x(point))
                coord.append(MyPoint.get_y(point))
                coord_list.append(coord)
            distances = []
            for i in range(len(coord_list) - 1):
                for j in range(i + 1, len(coord_list)):
                    distance = pow(
                        pow(coord_list[i][0] - coord_list[j][0], 2) +
                        pow(coord_list[i][1] - coord_list[j][1], 2), .5
                    )
                    distances.append(distance)
            return f"The maximum distance between two points in the infrastructure is {max(distances)}\n"
        else:
            return ValueError(f"There are {self.get_number_of_points()} "
                              f"points in the infrastructure. You need at least 2. Add some first!\n")

    def shift_points_on_x_axis(self):
        """
        ex. 16
        Shift all points on the x axis
        :return:
        """
        if self.get_number_of_points() > 0:
            for point in self.points:
                MyPoint.set_y(point, 0)
            new_list = PointRepository(self.points)
            return new_list
        else:
            return ValueError("There are no points in the infrastructure. Add some first:)\n")

    def get_points_inside_circle(self, center: list, radius):
        """
        ex. 11
        Get all points that are inside a given circle (center of circle, radius given)
        :param center: a list with the x and y coordinate of the center of the circle
        :param radius: an integer representing the radius of the circle
        :return:
        """
        if self.get_number_of_points() > 0:
            list_points_inside_circle = PointRepository()
            if type(center[0]) == int:
                if type(center[1]) == int:
                    if type(radius) == int and 0 < radius:
                        for point in self.points:
                            if MyPoint.get_x(point) > center[0] and MyPoint.get_y(point) > center[1]:
                                if MyPoint.get_x(point) < (center[0] + radius) \
                                        and MyPoint.get_y(point) < (center[1] + radius):
                                    list_points_inside_circle.add_point([
                                        MyPoint.get_x(point),
                                        MyPoint.get_y(point),
                                        MyPoint.get_col(point)
                                    ])
                        if list_points_inside_circle.get_number_of_points() == 0:
                            raise ValueError("There are no points in the given circle!\n")
                        else:
                            return list_points_inside_circle
                    else:
                        raise ValueError("The radius must be a positive number greater than 10!\n")
                else:
                    raise ValueError("The y coordinate must be a number!\n")
            else:
                raise ValueError("The x coordinate must be a number!\n")
        else:
            return ValueError("There are no points in the infrastructure. Add some first:)\n")

    def delete_points_inside_circle(self, center: list, radius):
        """
        ex. 19
        Delete all points that are inside a given circle
        :param center: a list with the x and y coordinate of the center of the circle
        :param radius: an integer representing the radius of the circle
        :return:
        """
        if self.get_number_of_points() > 0:
            list_points_inside_circle = PointRepository()
            list_points_to_delete = []
            if type(center[0]) == int:
                if type(center[1]) == int:
                    if type(radius) == int and 0 < radius:
                        for point in self.points:
                            if MyPoint.get_x(point) > center[0] and MyPoint.get_y(point) > center[1]:
                                if MyPoint.get_x(point) < (center[0] + radius) \
                                        and MyPoint.get_y(point) < (center[1] + radius):
                                    list_points_inside_circle.add_point([
                                        MyPoint.get_x(point),
                                        MyPoint.get_y(point),
                                        MyPoint.get_col(point)
                                    ])
                                    list_points_to_delete.append(MyPoint(
                                        MyPoint.get_x(point),
                                        MyPoint.get_y(point),
                                        MyPoint.get_col(point)
                                    ))
                        for point in list_points_to_delete:
                            self.points.remove(point)
                        if list_points_inside_circle.get_number_of_points() == 0:
                            raise ValueError("There are no points in the given circle!\n")
                        else:
                            repr_str = 'Points deleted:\n'
                            repr_str += str(list_points_inside_circle) + '\n'
                            repr_str += 'Now the infrastructure is:\n'
                            repr_str += str(self.get_all_points()) + '\n'
                            return repr_str
                    else:
                        raise ValueError("The radius must be a positive number greater than 10!\n")
                else:
                    raise ValueError("The y coordinate must be a number!\n")
            else:
                raise ValueError("The x coordinate must be a number!\n")
        else:
            return ValueError("There are no points in the infrastructure. Add some first:)\n")
