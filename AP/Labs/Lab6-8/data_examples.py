from domain.pointcontroller import MyPoint
from infrastructure.pointrepository import PointRepository

points = PointRepository([
        MyPoint(1, 8, "blue"),
        MyPoint(2, 2, "red"),
        MyPoint(4, 5, "green"),
        MyPoint(5, 6, "yellow"),
        MyPoint(3, 8, "red"),
    ])

"""
1st data example
"""
points.add_point([6, 7, "pink"])
print(points)
"""
Point (1, 8) of color blue
Point (2, 2) of color red
Point (4, 5) of color green
Point (5, 6) of color yellow
Point (3, 8) of color red
Point (6, 7) of color pink
"""

"""
2nd data example
"""
print(points.get_all_points())
"""
Index 0 : Point (1, 8) of color blue
Index 1 : Point (2, 2) of color red
Index 2 : Point (4, 5) of color green
Index 3 : Point (5, 6) of color yellow
Index 4 : Point (3, 8) of color red
Index 5 : Point (6, 7) of color pink
"""

"""
3rd data example
"""
print(points.get_point_at_index(5))
print('\n')
"""
Point (6, 7) of color pink
"""

"""
4th data example
"""
print(points.get_points_of_color("red"))
"""
Point (2, 2) of color red
Point (3, 8) of color red
"""

"""
5th data example
"""
print(points.get_minimum_distance_two_points())
"""
The minimum distance between two points in the infrastructure is 1.4142135623730951
"""

"""
6th data example
"""
print(points.get_maximum_distance_two_points())
"""
The maximum distance between two points in the infrastructure is 6.4031242374328485
"""

"""
7th data example
"""
points.update_point_at_index(2, 1, 1, "magenta")
print(points.get_all_points())
"""
Index 0 : Point (1, 8) of color blue
Index 1 : Point (2, 2) of color red
Index 2 : Point (1, 1) of color magenta
Index 3 : Point (5, 6) of color yellow
Index 4 : Point (3, 8) of color red
Index 5 : Point (6, 7) of color pink
"""

"""
8th data example
"""
points.delete_point_at_index(0)
print(points.get_all_points())
"""
Index 0 : Point (2, 2) of color red
Index 1 : Point (1, 1) of color magenta
Index 2 : Point (5, 6) of color yellow
Index 3 : Point (3, 8) of color red
Index 4 : Point (6, 7) of color pink
"""

"""
9th data example
"""
points.shift_points_on_x_axis()
print(points.get_all_points())
"""
Index 0 : Point (2, 0) of color red
Index 1 : Point (1, 0) of color magenta
Index 2 : Point (5, 0) of color yellow
Index 3 : Point (3, 0) of color red
Index 4 : Point (6, 0) of color pink
"""

"""
10th data example
"""
points.shift_points_on_x_axis()
print(points.get_all_points())
"""
Index 0 : Point (2, 0) of color red
Index 1 : Point (1, 0) of color magenta
Index 2 : Point (5, 0) of color yellow
Index 3 : Point (3, 0) of color red
Index 4 : Point (6, 0) of color pink
"""
