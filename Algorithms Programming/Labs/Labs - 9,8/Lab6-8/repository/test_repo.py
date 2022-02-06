from domain.pointcontroller import MyPoint
from infrastructure.pointrepository import PointRepository
import unittest


class PointRepositoryTest(unittest.TestCase):
    def setUp(self):
        # this function will be called right before each test
        self.empty_points_list = PointRepository()
        self.points_list1 = PointRepository([
            MyPoint(1, 2, "blue"),
            MyPoint(4, 5, "red"),
            MyPoint(2, 2, "green")
        ])
        self.points_list2 = PointRepository([
            MyPoint(1, 2, "blue"),
            MyPoint(4, 5, "red"),
            MyPoint(2, 2, "green"),
            MyPoint(6, 4, "red"),
            MyPoint(2, 9, "blue")
        ])

    def test_add_point(self):
        """
        Test function add_point
        :return:
        """
        points_list = PointRepository([MyPoint(1, 2, "blue")])
        self.assertRaises(ValueError, points_list.add_point, [1, 2, "blue"])
        self.assertRaises(ValueError, points_list.add_point, ["three", 2, "blue"])
        self.assertTrue(points_list.add_point, [2, 2, "blue"])

    def test_get_all_points(self):
        """
        Test function get_all_points
        :return:
        """
        self.assertEqual(self.points_list1.get_all_points(), PointRepository([
                                                                    MyPoint(1, 2, "blue"),
                                                                    MyPoint(4, 5, "red"),
                                                                    MyPoint(2, 2, "green")
                                                                ]))
        self.assertEqual(self.points_list2.get_all_points(), PointRepository([
                                                                    MyPoint(1, 2, "blue"),
                                                                    MyPoint(4, 5, "red"),
                                                                    MyPoint(2, 2, "green"),
                                                                    MyPoint(6, 4, "red"),
                                                                    MyPoint(2, 9, "blue")
                                                                ]))


if __name__ == '__main__':
    unittest.main()
