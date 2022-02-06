from unittest import TestCase
import numpy
from domain.vector_model import MyVector


class MyVectorTest(TestCase):
    """
    Tested the constructor, the getter and setter methods. Tested other functionalities in the controller.
    """

    def setUp(self):
        self.vector1 = MyVector("V1", "r", 2, [1, 3, 4])
        self.vector2 = MyVector("V2", "m", 3, [2, 6, 9])
        self.vector3 = MyVector("V3", "r", 2, [1, 3, 4])
        self.vector4 = MyVector("V4", "y", 1, [1.5, 3.3])
        self.vector5 = MyVector("V5", "b", 10, [15.5])

    def test_create(self):
        self.assertEqual(self.vector1.get_name_id(), "V1")
        self.assertEqual(self.vector2.get_name_id(), "V2")
        self.assertEqual(self.vector1.get_color(), "r")
        self.assertEqual(self.vector1.get_type(), 2)
        self.assertTrue((self.vector1.get_values() == numpy.array([1, 3, 4])).all())

    def test_setters(self):
        self.vector1.set_name_id("V1.1")
        self.assertEqual(self.vector1.get_name_id(), "V1.1")
        self.vector2.set_color("y")
        self.assertEqual(self.vector2.get_color(), "y")
        self.assertRaises(AttributeError, self.vector2.set_type, 0)
        self.assertEqual(self.vector2.get_type(), 3)
        self.vector3.set_values([1, 1, 1])
        self.assertTrue((self.vector3.get_values() == numpy.array([1, 1, 1])).all())
