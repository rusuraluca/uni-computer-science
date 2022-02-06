"""
This is the module for the user interface.
"""

from domain.pointcontroller import MyPoint
from infrastructure.pointrepository import PointRepository
from matplotlib.colors import is_color_like


def print_menu():
    """
    Print the menu options available in the interface.
    :return:
    """
    print("Welcome! Here is the menu of the program:")
    print("0 - Exit Program")
    print("1 - Print Menu")
    print("2 - Add a new point to the infrastructure")
    print("3 - Get all the existing points in the infrastructure")
    print("4 - Get a point at a given index from the infrastructure")
    print("5 - Get all points of a given color from the infrastructure")
    print("6 - Get the minimum distance between two points from the infrastructure")
    print("7 - Get the maximum distance between two points from the infrastructure")
    print("8 - Update a point from the infrastructure by index")
    print("9 - Delete a point from the infrastructure by index")
    print("10 - Get all points from the infrastructure that are inside a given square")
    print("11 - Delete all points from the infrastructure that are inside a given square")
    print("12 - Get all points from the infrastructure that are inside a given circle")
    print("13 - Delete all points from the infrastructure that are inside a given circle")
    print("14 - Shift all points on the x axis")
    print("15 - Plot all points from the infrastructure in a chart (using library matplotlib)")


def isdigit(num):
    try:
        int(num)
        return True
    except ValueError:
        return False


def start():
    """
    Start the menu type console.
    :return:
    """
    print_menu()
    print("Choose a command you want to access:")
    command = input(">>> ")

    points_list = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(4, 5, "red"),
        MyPoint(2, 2, "green"),
        MyPoint(6, 4, "red"),
        MyPoint(2, 9, "blue"),
        MyPoint(7, 9, "magenta")
    ])

    while command != "0":
        try:
            if command == "1":
                print_menu()

            elif command == "2":
                # Add a new point to the infrastructure
                print("Let's add a new point to the infrastructure!")
                new_entry = []
                x = input("Give the x coordinate of the point: ")
                if isdigit(x):
                    y = input("Give the y coordinate of the point: ")
                    if isdigit(y):
                        col = input("Give the color of the point: ")
                        if is_color_like(col):
                            new_entry.append(int(x))
                            new_entry.append(int(y))
                            new_entry.append(col)
                            try:
                                points_list.add_point(new_entry)
                                print(f"\nAdded {MyPoint(new_entry[0], new_entry[1], new_entry[2])}\n")
                            except ValueError as ve:
                                print(f"\n{ve}")
                        else:
                            raise ValueError("\nThe color of the point must be a string representing a color!\n")
                    else:
                        raise ValueError("\nThe y coordinate must be a number!\n")
                else:
                    raise ValueError("\nThe x coordinate must be a number!\n")

            elif command == "3":
                # Get all the existing points in the infrastructure
                print("All the existing points in the infrastructure:")
                print(points_list.get_all_points())

            elif command == "4":
                # Get a point at a given index from the infrastructure
                if points_list.get_number_of_points() > 0:
                    index = input("Give the index of the point you want to see: ")
                    if isdigit(index):
                        if 0 <= int(index) < points_list.get_number_of_points():
                            try:
                                print(f"\nThe searched point is {points_list.get_point_at_index(int(index))}.\n")
                            except ValueError as ve:
                                print(f"\n{ve}")
                        else:
                            raise ValueError(f"\nThe index must be between "
                                             f"[0-{points_list.get_number_of_points() - 1}]!\n")
                    else:
                        raise ValueError("\nThe index must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "5":
                # Get all points of a given color from the infrastructure
                if points_list.get_number_of_points() > 0:
                    color = input("Give the color of the points you want to see: ")
                    if is_color_like(color) and isdigit(color) is False:
                        try:
                            print(f"\nThe searched points are: \n{points_list.get_points_of_color(color)}")
                        except ValueError as ve:
                            print(f"\n{ve}")
                    else:
                        raise ValueError("The color of the point must be a string representing a color!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "6":
                print(points_list.get_minimum_distance_two_points())

            elif command == "7":
                print(points_list.get_maximum_distance_two_points())

            elif command == "8":
                if points_list.get_number_of_points() > 0:
                    index = input("Give the index of the point you want to update: ")
                    if isdigit(index):
                        if 0 <= int(index) < points_list.get_number_of_points():
                            print(f"\nThe point is {points_list.get_point_at_index(int(index))}\n")
                            x = input("Give the updated x coordinate of the point: ")
                            if isdigit(x):
                                y = input("Give the updated y coordinate of the point: ")
                                if isdigit(y):
                                    col = input("Give the updated color of the point: ")
                                    if is_color_like(col) and isdigit(col) is False:
                                        try:
                                            points_list.update_point_at_index(int(index), int(x), int(y), col)
                                            print(f"\nPoint updated: Now the point is "
                                                  f"{points_list.get_point_at_index(int(index))} \n")
                                        except ValueError as ve:
                                            print(f"\n{ve}")
                                    else:
                                        raise ValueError("\nThe color of the point must be a "
                                                         "string representing a color!\n")
                                else:
                                    raise ValueError("\nThe y coordinate must be a number!\n")
                            else:
                                raise ValueError("\nThe x coordinate must be a number!\n")
                        else:
                            raise ValueError(f"\nThe index must be between "
                                             f"[0-{points_list.get_number_of_points() - 1}]!\n")
                    else:
                        raise ValueError("\nThe index must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "9":
                if points_list.get_number_of_points() > 0:
                    print(points_list.get_all_points())
                    index = input("Give the index of the point you want to delete:")
                    if isdigit(index):
                        if 0 <= int(index) < points_list.get_number_of_points():
                            try:
                                print(f"\n{points_list.delete_point_at_index(int(index))} deleted!")
                                print("\nNow this is the list:")
                                print(points_list.get_all_points())
                            except ValueError as ve:
                                print(f"\n{ve}")
                        else:
                            raise ValueError(f"\nThe index must be between "
                                             f"[0-{points_list.get_number_of_points()-1}]!\n")
                    else:
                        raise ValueError("\nThe index must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "10":
                # Get all points from the infrastructure that are inside a given square
                if points_list.get_number_of_points() > 0:
                    up_left = []
                    up_left_x = input("Give the x coordinate of the up left corner of the square: ")
                    if isdigit(up_left_x):
                        up_left_y = input("Give the y coordinate of the up left corner of the square: ")
                        if isdigit(up_left_y):
                            length = input("Give the length of the square: ")
                            if isdigit(length):
                                up_left.append(int(up_left_x))
                                up_left.append(int(up_left_y))
                                try:
                                    print(f"\nThe points inside given square are:"
                                          f"\n{points_list.get_points_inside_square(up_left, int(length))}")
                                except ValueError as ve:
                                    print(f"\n{ve}")
                            else:
                                raise ValueError("\nThe length must be a positive number greater than 0!\n")
                        else:
                            raise ValueError("\nThe y coordinate must be a number!\n")
                    else:
                        raise ValueError("\nThe x coordinate must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "11":
                # Delete all points from the infrastructure that are inside a given square
                if points_list.get_number_of_points() > 0:
                    up_left = []
                    up_left_x = input("Give the x coordinate of the up left corner of the square: ")
                    if isdigit(up_left_x):
                        up_left_y = input("Give the y coordinate of the up left corner of the square: ")
                        if isdigit(up_left_y):
                            length = input("Give the length of the square: ")
                            if isdigit(length) and 0 < int(length):
                                up_left.append(int(up_left_x))
                                up_left.append(int(up_left_y))
                                try:
                                    print(f"\n{points_list.delete_points_inside_square(up_left, int(length))}")
                                except ValueError as ve:
                                    print(f"\n{ve}")
                            else:
                                raise ValueError("\nThe length must be a positive number greater than 0!\n")
                        else:
                            raise ValueError("\nThe y coordinate must be a number!\n")
                    else:
                        raise ValueError("\nThe x coordinate must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "12":
                # Get all points from the infrastructure that are inside a given circle
                if points_list.get_number_of_points() > 0:
                    center = []
                    center_x = input("Give the x coordinate of the center of the circle: ")
                    if isdigit(center_x):
                        center_y = input("Give the y coordinate of the center of the circle: ")
                        if isdigit(center_y):
                            radius = input("Give the radius of the circle: ")
                            if isdigit(radius) and 0 < int(radius):
                                center.append(int(center_x))
                                center.append(int(center_y))
                                try:
                                    print(f"\nThe points inside given circle are:"
                                          f"\n{points_list.get_points_inside_circle(center, int(radius))}")
                                except ValueError as ve:
                                    print(f"\n{ve}")
                            else:
                                raise ValueError("\nThe radius must be a positive number greater than 10!\n")
                        else:
                            raise ValueError("\nThe y coordinate must be a number!\n")
                    else:
                        raise ValueError("\nThe x coordinate must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "13":
                # Delete all points from the infrastructure that are inside a given circle
                if points_list.get_number_of_points() > 0:
                    center = []
                    center_x = input("Give the x coordinate of the center of the circle: ")
                    if isdigit(center_x):
                        center_y = input("Give the y coordinate of the center of the circle: ")
                        if isdigit(center_y):
                            radius = input("Give the radius of the circle: ")
                            if isdigit(radius) and 0 < int(radius):
                                center.append(int(center_x))
                                center.append(int(center_y))
                                try:
                                    print(f"\n{points_list.delete_points_inside_circle(center, int(radius))}")
                                except ValueError as ve:
                                    print(f"\n{ve}")
                            else:
                                raise ValueError("\nThe radius must be a positive number greater than 10!\n")
                        else:
                            raise ValueError("\nThe y coordinate must be a number!\n")
                    else:
                        raise ValueError("\nThe x coordinate must be a number!\n")
                else:
                    print(points_list.get_all_points())

            elif command == "14":
                # Shift all points on the x axis
                print(points_list.shift_points_on_x_axis())
                # Plot them in a chart after
                points_list.plot_points_in_chart()

            elif command == "15":
                # Plot all points from the infrastructure in a chart
                print(points_list.plot_points_in_chart())

            else:
                print("Invalid command")

            command = input(">>> ")

        except ValueError as ve:
            print(f"\n{ve}")
