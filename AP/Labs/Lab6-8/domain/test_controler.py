from domain.pointcontroller import MyPoint
import unittest


class MyPointTest(unittest.TestCase):
    def setUp(self):
        # this function will be called right before each test
        self.point1 = MyPoint(1, 2, "blue")
        self.point2 = MyPoint(6, 4, "red")

    def test_get_x(self):
        """
        Test function get_x
        :return:
        """
        self.assertEqual(MyPoint.get_x(self.point1), 1)
        self.assertEqual(MyPoint.get_x(self.point2), 6)

    def test_get_y(self):
        """
        Test function get_y
        :return:
        """
        self.assertEqual(MyPoint.get_y(self.point1), 2)
        self.assertEqual(MyPoint.get_y(self.point2), 4)


if __name__ == '__main__':
    unittest.main()
