from domain.pointcontroller import MyPoint
from infrastructure.pointrepository import PointRepository


# Assertions
def test_add_point():
    """
    Test function for add_point
    :return:
    """

    # if the properties are correctly introduced
    points = PointRepository()
    points.add_point([1, 2, "blue"])
    assert points.get_number_of_points() == 1
    assert points == PointRepository([MyPoint(1, 2, "blue")])

    # if the properties introduced aren't correct
    try:
        points.add_point(["blue", 1, 3])
    except ValueError as ve:
        assert str(ve) == "The x coordinate must be a number!\n"
        assert True

    # if the properties introduced aren't correct
    try:
        points.add_point([1, 1, 3])
    except ValueError as ve:
        assert str(ve) == "The color of the point must be a string representing a color!\n"
        assert True

    # if the point is already in the infrastructure
    try:
        points.add_point([1, 2, "blue"])
    except ValueError as ve:
        assert str(ve) == "This point is already in the infrastructure!\n"
        assert True


def test_get_all_points():
    """
    Test function for get_all_points
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    assert points.get_number_of_points() == 0
    try:
        points.get_all_points()
    except ValueError as ve:
        assert str(ve) == "There are no points in the infrastructure. Add some first :)\n"
        assert True

    # if we have one point in the infrastructure
    points = PointRepository([
        MyPoint(1, 2, "blue")
    ])
    points.get_number_of_points() == 1
    try:
        points.get_all_points()
        assert True
    except ValueError:
        assert False

    # if we have more points in the infrastructure
    points = PointRepository([
            MyPoint(1, 2, "blue"),
            MyPoint(4, 5, "red"),
            MyPoint(2, 2, "green"),
            MyPoint(6, 4, "red"),
            MyPoint(2, 9, "blue")
        ])
    points.get_number_of_points() == 5
    try:
        points.get_all_points()
        assert True
    except ValueError:
        assert False


def test_get_point_at_index():
    """
    Test function for get_point_at_index
    :return:
    """
    # if the infrastructure is empty
    points = PointRepository()
    assert points.get_number_of_points() == 0
    try:
        points.get_point_at_index(1)
    except ValueError as ve:
        assert str(ve) == "There are no points in the infrastructure. Add some first :)\n"
        assert True

    # if the infrastructure is not empty and the index is correctly introduced
    points = PointRepository([
        MyPoint(1, 8, "blue"),
        MyPoint(2, 2, "red"),
        MyPoint(4, 5, "green")
    ])
    assert points.get_point_at_index(0) == MyPoint(1, 8, "blue")

    # if the index is not correctly introduced (is not a number)
    try:
        points.get_point_at_index('three')
        assert False
    except ValueError as ve:
        assert str(ve) == 'The index must be a number!\n'
        assert True

    # if the index is not existent in the points infrastructure
    try:
        points.get_point_at_index(3)
        assert False
    except ValueError as ve:
        assert str(ve) == f'The index must be between [0-{points.get_number_of_points()-1}]!\n'
        assert True


def test_get_points_of_color():
    """
    Test function for get_points_of_color
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    assert points.get_number_of_points() == 0
    try:
        points.get_points_of_color("blue")
    except ValueError as ve:
        assert str(ve) == "There are no points in the infrastructure. Add some first :)\n"
        assert True

    # if the infrastructure is not empty and the color is correctly introduced
    points = PointRepository([
        MyPoint(1, 8, "blue"),
        MyPoint(2, 2, "red"),
        MyPoint(4, 5, "green")
    ])
    assert points.get_points_of_color("blue") == PointRepository([MyPoint(1, 8, "blue")])

    # if the color isn't correctly introduced (it's a number or a string that doesn't represent a color)
    try:
        points.get_points_of_color('1')
        assert False
    except ValueError as ve:
        assert str(ve) == "The color of the point must be a string representing a color!\n"
        assert True

    try:
        points.get_points_of_color('three')
        assert False
    except ValueError as ve:
        assert str(ve) == "The color of the point must be a string representing a color!\n"
        assert True

    # if there are no points of such color
    try:
        points.get_points_of_color('yellow')
        assert False
    except ValueError as ve:
        assert str(ve) == "The color doesn't represent any point!\n"
        assert True


def test_get_maximum_distance_two_points():
    """
    Test function for get_maximum_distance_two_points
    :return:
    """

    # if there are no points in the infrastructure
    points = PointRepository()
    try:
        points.get_maximum_distance_two_points()
    except ValueError as ve:
        assert str(ve) == 'There are 0 points in the infrastructure. You need at least 2. Add some first!\n'
        assert True

    # if there is one point in the infrastructure
    points = PointRepository([
        MyPoint(4, 7, "blue")
    ])
    try:
        points.get_maximum_distance_two_points()
    except ValueError as ve:
        assert str(ve) == 'There are 1 points in the infrastructure. You need at least 2. Add some first!\n'
        assert True

    # if there are at least two points in the infrastructure
    points = PointRepository([
        MyPoint(4, 7, "blue"),
        MyPoint(9, 9, "blue")
    ])
    min_dist = points.get_maximum_distance_two_points()
    assert min_dist == 'The maximum distance between two points in the infrastructure is 5.385164807134504\n'

    # if there are more points in the infrastructure
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    min_dist = points.get_maximum_distance_two_points()
    assert min_dist == 'The maximum distance between two points in the infrastructure is 7.0710678118654755\n'


def test_get_minimum_distance_two_points():
    """
    Test function for get_minimum_distance_two_points
    :return:
    """

    # if there are no points in the infrastructure
    points = PointRepository()
    try:
        points.get_minimum_distance_two_points()
    except ValueError as ve:
        assert str(ve) == 'There are 0 points in the infrastructure. You need at least 2. Add some first!\n'
        assert True

    # if there is one point in the infrastructure
    points = PointRepository()
    try:
        points.get_minimum_distance_two_points()
    except ValueError as ve:
        assert str(ve) == 'There are 1 points in the infrastructure. You need at least 2. Add some first!\n'
        assert True

    # if there are at least two points in the infrastructure
    points = PointRepository([
        MyPoint(4, 7, "blue"),
        MyPoint(9, 9, "blue")
    ])
    min_dist = points.get_minimum_distance_two_points()
    assert min_dist == 'The minimum distance between two points in the infrastructure is 5.385164807134504\n'

    # if there are more points in the infrastructure
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    min_dist = points.get_minimum_distance_two_points()
    assert min_dist == 'The minimum distance between two points in the infrastructure is 2.8284271247461903\n'


def test_update_point_at_index():
    """
    Test function for update_point_at_index
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    assert points.get_number_of_points() == 0
    try:
        points.update_point_at_index(0, 6, 4, "green")
    except ValueError as ve:
        assert str(ve) == "There are no points in the infrastructure. Add some first :)\n"
        assert True

    # if the infrastructure is not empty and the index is correctly introduced
    points = PointRepository([
        MyPoint(6, 3, "red"),
        MyPoint(3, 4, "blue")
    ])
    points.update_point_at_index(0, 6, 4, "green")
    assert points == PointRepository([MyPoint(6, 4, "green"), MyPoint(3, 4, "blue")])

    # if the index is not existent in the points infrastructure
    try:
        points.update_point_at_index(3, 1, 2, "red")
    except ValueError as ve:
        assert str(ve) == 'The index must be between [0-2]!\n'

    # if the index is not a number
    try:
        points.update_point_at_index("three", 6, 2, "green")
        assert False
    except ValueError as ve:
        assert str(ve) == 'The index must be a number!\n'
        assert True

    # if the updated point is already in the infrastructure
    try:
        points.update_point_at_index(0, 3, 4, "blue")
        assert False
    except ValueError as ve:
        assert str(ve) == 'This point is already in the infrastructure! Try again!\n'
        assert True


def test_delete_point_at_index():
    """
    Test function for delete_point_at_index
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    assert points.get_number_of_points() == 0
    try:
        points.delete_point_at_index(3)
    except ValueError as ve:
        assert str(ve) == "There are no points in the infrastructure. Add some first :)\n"
        assert True

    # if the index is correctly introduced
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red")
    ])
    assert points.get_number_of_points() == 2
    points.delete_point_at_index(0)
    assert points.get_number_of_points() == 1

    # if the index is not existent in the points infrastructure
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red")
    ])
    try:
        points.delete_point_at_index(3)
        assert False
    except ValueError as ve:
        assert str(ve) == "The index must be between [0-1]!\n"
        assert True

    # if the index is not a number
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red")
    ])
    try:
        points.delete_point_at_index("three")
        assert False
    except ValueError as ve:
        assert str(ve) == "The index must be a number!\n"
        assert True


def test_shift_points_on_x_axis():
    """
    Test function for shift_points_on_x_axis
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    assert points.get_number_of_points() == 0
    try:
        points.shift_points_on_x_axis()
    except ValueError as ve:
        assert str(ve) == "There are no points in the infrastructure. Add some first:)\n"
        assert True

    # if the infrastructure has one point
    points = PointRepository([
        MyPoint(1, 2, "blue"),
    ])
    assert points.get_number_of_points() == 1
    points.shift_points_on_x_axis()
    assert points == PointRepository([MyPoint(1, 0, "blue")])

    # if the infrastructure has more points
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    assert points.get_number_of_points() == 3
    points.shift_points_on_x_axis()
    assert points == PointRepository([
        MyPoint(1, 0, "blue"),
        MyPoint(3, 0, "red"),
        MyPoint(2, 0, "blue")
    ])


def test_get_points_inside_square():
    """
    Test function for get_points_inside_square
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    try:
        points.get_points_inside_square([0, 0], 1)
    except ValueError as ve:
        assert str(ve) == 'There are 0 points in the infrastructure. Add some first!\n"'
        assert True

    # if the infrastructure is not empty and the elements of the square are correctly introduced
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    assert points.get_points_inside_square([1, 8], 10) == PointRepository([MyPoint(2, 9, "blue")])

    # if the elements of the square are not correctly introduced
    try:
        points.get_points_inside_square(['three', 8], 10)
    except ValueError as ve:
        assert str(ve) == 'The x coordinate must be a number!\n'
        assert True

    # if no points are in the given square
    try:
        points.get_points_inside_square([0, 0], 1)
    except ValueError as ve:
        assert str(ve) == 'There are no points in the given square!\n'
        assert True


def test_delete_points_inside_square():
    """
    Test function for delete_points_inside_square
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    try:
        points.delete_points_inside_square([0, 0], 1)
    except ValueError as ve:
        assert str(ve) == 'There are 0 points in the infrastructure. Add some first!\n"'
        assert True

    # if the infrastructure is not empty and the elements of the square are correctly introduced
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    assert points.get_number_of_points() == 3
    points.delete_points_inside_square([1, 8], 10)
    assert points.get_number_of_points() == 2

    # if the elements of the square are not correctly introduced
    try:
        points.delete_points_inside_square(['three', 8], 10)
    except ValueError as ve:
        assert str(ve) == 'The x coordinate must be a number!\n'
        assert True

    # if no points are in the given square
    try:
        points.delete_points_inside_square([0, 0], 1)
    except ValueError as ve:
        assert str(ve) == 'There are no points in the given square!\n'
        assert True


def test_get_points_inside_circle():
    """
    Test function for get_points_inside_circle
    :return:
    """

    # if the infrastructure is empty
    points = PointRepository()
    try:
        points.get_points_inside_circle([0, 0], 10)
    except ValueError as ve:
        assert str(ve) == 'There are 0 points in the infrastructure. Add some first!\n"'
        assert True

    # if the infrastructure is not empty and the elements of the circle are correctly introduced
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    assert points.get_points_inside_circle([0, 0], 10) == PointRepository([
                                                                MyPoint(1, 2, "blue"),
                                                                MyPoint(3, 4, "red"),
                                                                MyPoint(2, 9, "blue")
                                                            ])

    # if the elements of the circle are not correctly introduced
    try:
        points.get_points_inside_circle([1, 'three'], 10)
        assert False
    except ValueError as ve:
        assert str(ve) == 'The y coordinate must be a number!\n'
        assert True

    # if no points are in the given circle
    try:
        points.get_points_inside_circle([0, 0], 1)
        assert False
    except ValueError as ve:
        assert str(ve) == 'There are no points in the given circle!\n'
        assert True


def test_delete_points_inside_circle():
    """
    Test function for delete_points_inside_circle
    :return:
    """
    # if the infrastructure is empty
    points = PointRepository()
    try:
        points.delete_points_inside_circle([0, 0], 10)
    except ValueError as ve:
        assert str(ve) == 'There are 0 points in the infrastructure. Add some first!\n"'
        assert True

    # if the infrastructure is not empty and the elements of the circle are correctly introduced
    points = PointRepository([
        MyPoint(1, 2, "blue"),
        MyPoint(3, 4, "red"),
        MyPoint(2, 9, "blue")
    ])
    assert points.get_number_of_points() == 3
    points.delete_points_inside_circle([1, 8], 10)
    assert points.get_number_of_points() == 2

    # if the elements of the circle are not correctly introduced
    try:
        points.delete_points_inside_circle([1, 2], 'three')
    except ValueError as ve:
        assert str(ve) == 'The radius must be a positive number greater than 10!\n'
        assert True

    # if no points are in the given circle
    try:
        points.delete_points_inside_circle([0, 0], 1)
    except ValueError as ve:
        assert str(ve) == 'There are no points in the given circle!\n'
        assert True


def all_tests():
    """
    Run all tests.
    :return:
    """
    # 1
    test_add_point()
    # 2
    test_get_all_points()
    # 3
    test_get_point_at_index()
    # 4
    test_get_points_of_color()
    # 5
    test_get_maximum_distance_two_points()
    # 6
    test_get_minimum_distance_two_points()
    # 7
    test_update_point_at_index()
    # 8
    test_delete_point_at_index()
    # 9
    test_get_points_inside_square()
    # 10
    test_delete_points_inside_square()
    # 11
    test_get_points_inside_circle()
    # 12
    test_delete_points_inside_circle()
    # 13
    test_shift_points_on_x_axis()
