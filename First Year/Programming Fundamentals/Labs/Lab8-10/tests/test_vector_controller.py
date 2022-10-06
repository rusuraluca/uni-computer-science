from unittest import TestCase
import numpy
from domain.vector_model import MyVector
from infrastructure.vector_repository import VectorRepository
from application.vector_controller import VectorController


class VectorControllerTest(TestCase):
    def setUp(self):
        self.controller0 = VectorController(VectorRepository())
        self.controller1 = VectorController(VectorRepository([
            MyVector("V1", "r", 2, [1, 3, 4])
        ]))
        self.controller2 = VectorController(VectorRepository([
            MyVector("V1", "r", 2, [1, 3, 4]),
            MyVector("V2", "m", 3, [2, 6, 9]),
            MyVector("V3", "r", 2, [1, 3, 4])
        ]))
        self.controller3 = VectorController(VectorRepository([
            MyVector("SA", "r", 2, [1, 3, 4.5]),
            MyVector("SB", "m", 3, [2.23, 6.45, 9.34]),
            MyVector("SC", "b", 1, [1, 9, 7]),
            MyVector("SD", "y", 9, [4.5, 2.8, 4.8])
        ]))
        self.controller4 = VectorController(VectorRepository([
            MyVector("I", "r", 2, [1, 3, 4.5]),
            MyVector("K", "m", 3, [2.23, 6.45, 9.34]),
            MyVector("2", "m", 3, [2.23, 6.45, 9.34])
        ]))
        self.vector1 = MyVector("V1", "r", 2, [1, 3, 4])
        self.vector2 = MyVector("V2", "m", 3, [2, 6, 9])
        self.vector3 = MyVector("V3", "r", 2, [1, 3, 4])
        self.vector4 = MyVector("V4", "y", 1, [1.5, 3.3])
        self.vector5 = MyVector("V5", "b", 10, [15.5])

    def test_add(self):
        self.assertTrue((self.vector1.add(self.vector2) == numpy.array([3, 9, 13])).all())
        self.assertTrue((self.vector1.add(self.vector3) == numpy.array([2, 6, 8])).all())
        self.assertTrue((self.vector2.add(self.vector3) == numpy.array([3, 9, 13])).all())
        self.assertRaises(AttributeError, self.vector3.add, self.vector4)
        self.assertRaises(AttributeError, self.vector5.add, self.vector4)

    def test_subtract(self):
        self.assertTrue((self.vector1.subtract(self.vector2) == numpy.array([-1, -3, -5])).all())
        self.assertTrue((self.vector1.subtract(self.vector3) == numpy.array([0, 0, 0])).all())
        self.assertTrue((self.vector2.subtract(self.vector3) == numpy.array([1, 3, 5])).all())
        self.assertRaises(AttributeError, self.vector4.subtract, self.vector3)
        self.assertRaises(AttributeError, self.vector5.subtract, self.vector4)

    def test_multiply(self):
        self.assertEqual(self.vector1.multiply(self.vector2), 56)
        self.assertEqual(self.vector1.multiply(self.vector3), 26)
        self.assertEqual(self.vector2.multiply(self.vector3), 56)
        self.assertRaises(AttributeError, self.vector4.subtract, self.vector3)
        self.assertRaises(AttributeError, self.vector5.subtract, self.vector4)

    def test_add_scalar(self):
        self.vector1.add_scalar(3)
        self.assertTrue((self.vector1.get_values() == numpy.array([4, 6, 7])).all())
        self.vector2.add_scalar(-6)
        self.assertTrue((self.vector2.get_values() == numpy.array([-4, 0, 3])).all())
        self.vector3.add_scalar(9)
        self.assertTrue((self.vector3.get_values() == numpy.array([10, 12, 13])).all())
        self.assertRaises(AttributeError, self.vector3.add_scalar, "4Y")
        self.assertRaises(AttributeError, self.vector5.add_scalar, "456.345")

    def test_num_of_elements(self):
        self.assertEqual(self.vector1.num_of_elements(), 3)
        self.assertEqual(self.vector2.num_of_elements(), 3)
        self.assertEqual(self.vector3.num_of_elements(), 3)
        self.assertEqual(self.vector4.num_of_elements(), 2)
        self.assertEqual(self.vector5.num_of_elements(), 1)

    def test_sum_of_elements(self):
        self.assertEqual(self.vector1.sum_of_elements(), 8)
        self.assertEqual(self.vector2.sum_of_elements(), 17)
        self.assertEqual(self.vector3.sum_of_elements(), 8)
        self.assertEqual(self.vector4.sum_of_elements(), 4.8)
        self.assertEqual(self.vector5.sum_of_elements(), 15.5)

    def test_product_of_elements(self):
        self.assertEqual(self.vector1.product_of_elements(), 12)
        self.assertEqual(self.vector2.product_of_elements(), 108)
        self.assertEqual(self.vector3.product_of_elements(), 12)
        self.assertEqual(self.vector4.product_of_elements(), 4.949999999999999)
        self.assertEqual(self.vector5.product_of_elements(), 15.5)

    def test_average_of_elements(self):
        self.assertEqual(self.vector1.average_of_elements(), 2.6666666666666665)
        self.assertEqual(self.vector2.average_of_elements(), 5.666666666666667)
        self.assertEqual(self.vector3.average_of_elements(), 2.6666666666666665)
        self.assertEqual(self.vector4.average_of_elements(), 2.4)
        self.assertEqual(self.vector5.average_of_elements(), 15.5)

    def test_min_of_elements(self):
        self.assertEqual(self.vector1.min_of_elements(), 1)
        self.assertEqual(self.vector2.min_of_elements(), 2)
        self.assertEqual(self.vector3.min_of_elements(), 1)
        self.assertEqual(self.vector4.min_of_elements(), 1.5)
        self.assertEqual(self.vector5.min_of_elements(), 15.5)

    def test_max_of_elements(self):
        self.assertEqual(self.vector1.max_of_elements(), 4)
        self.assertEqual(self.vector2.max_of_elements(), 9)
        self.assertEqual(self.vector3.max_of_elements(), 4)
        self.assertEqual(self.vector4.max_of_elements(), 3.3)
        self.assertEqual(self.vector5.max_of_elements(), 15.5)

    def test_get_all_vectors(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.get_all_vectors)

        # if not empty repositories
        self.assertTrue(self.controller1.get_all_vectors())
        self.assertTrue(self.controller2.get_all_vectors())
        self.assertTrue(self.controller3.get_all_vectors())
        self.assertTrue(self.controller4.get_all_vectors())

    def test_add_vector(self):
        # if parameters correctly introduced
        self.assertEqual(len(self.controller0), 0)
        self.controller0.add_vector("V", "r", 2, [1, 3, 4])
        self.assertEqual(len(self.controller0), 1)

        # if vector already in the repository
        self.assertRaises(IndexError, self.controller1.add_vector, "V1", "r", 2, [1, 3, 4])

        # if vector color is not a valid color
        self.assertRaises(AttributeError, self.controller0.add_vector, "V1", "NotAValidColor", 2, [1, 3, 4])

        # if vector type is not a valid type
        self.assertRaises(AttributeError, self.controller0.add_vector, "V1", "r", 0, [1, 3, 4])

        # if vector list of values is empty
        self.assertRaises(AttributeError, self.controller0.add_vector, "V1", "r", 1, [])

        # if vector list of values is not of numbers
        self.assertRaises(AttributeError, self.controller0.add_vector, "V1", "r", 1, ["a", "b", "c"])

    def test_get_vector_at_index(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.get_vector_at_index, 0)

        # if index out of range
        self.assertRaises(IndexError, self.controller1.get_vector_at_index, 9)

        # if index correctly introduced
        self.assertEqual(str(self.controller2.get_vector_at_index(1)),
                         "Vector V2 of color m and type 3 with values: [2 6 9]")

        # if index correctly introduced
        self.assertEqual(str(self.controller3.get_vector_at_index(3)),
                         "Vector SD of color y and type 9 with values: [4.5 2.8 4.8]")

        # if index correctly introduced
        self.assertEqual(str(self.controller4.get_vector_at_index(1)),
                         "Vector K of color m and type 3 with values: [2.23 6.45 9.34]")

    def test_update_vector_at_index(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.update_vector_at_index, 0, "V1", "y", 2, [1, 3, 4])

        # if index out of range
        self.assertRaises(IndexError, self.controller1.update_vector_at_index, 9, "v2", "r", 9, [1, 3, 4])

        # if color introduced is not a valid color
        self.assertRaises(AttributeError, self.controller2.update_vector_at_index, 0, "V1.1", "w", 2, [1, 3, 4])

        # if type introduced is not a valid type
        self.assertRaises(AttributeError, self.controller3.update_vector_at_index, 0, "SA.1", "r", 0, [1, 3, 4])

        # if the list of values is introduced as empty
        self.assertRaises(AttributeError, self.controller4.update_vector_at_index, 1, "SA", "r", 1, [])

        # if parameters introduced correctly
        self.assertEqual(str(self.controller4.update_vector_at_index(1, "SX", "r", 1, [1.4, 5, 7])),
                         "Vector SX of color r and type 1 with values: [1.4 5 7]")

    def test_update_vector_by_name_id(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.update_vector_by_name_id, "V1", "y", 2, [1, 3, 4])

        # if name_id non existent in the repository
        self.assertRaises(IndexError, self.controller1.update_vector_by_name_id, "SB", "r", 9, [1, 3, 4])

        # if color introduced is not a valid color
        self.assertRaises(AttributeError, self.controller2.update_vector_by_name_id, "V1", "w", 2, [1, 3, 4])

        # if type introduced is not a valid type
        self.assertRaises(AttributeError, self.controller3.update_vector_by_name_id, "SA", "r", 0, [1, 3, 4])

        # if the list of values is introduced as empty
        self.assertRaises(AttributeError, self.controller3.update_vector_by_name_id, "SA", "r", 0, [])

        # if parameters introduced correctly
        self.assertEqual(str(self.controller4.update_vector_by_name_id("K", "r", 1, [1.4, 5, 7])),
                         "Vector K of color r and type 1 with values: [1.4 5 7]")

    def test_delete_vector_at_index(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.delete_vector_at_index, 0)

        # if index out of range
        self.assertRaises(IndexError, self.controller1.delete_vector_at_index, 9)

        # if index introduced not integer
        self.assertRaises(AttributeError, self.controller4.delete_vector_at_index, "y")

        # if index introduced correctly
        self.assertEqual(len(self.controller2), 3)
        self.controller2.delete_vector_at_index(1)
        self.assertEqual(len(self.controller2), 2)

        # if index introduced correctly
        self.assertEqual(len(self.controller3), 4)
        self.controller3.delete_vector_at_index(0)
        self.assertEqual(len(self.controller3), 3)

    def test_delete_vector_by_name_id(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.delete_vector_by_name_id, "V1")

        # if name_id non existent in the repository
        self.assertRaises(IndexError, self.controller1.delete_vector_by_name_id, "NotANameID")

        # if name_id introduced is not a valid name_id (not string)
        self.assertRaises(IndexError, self.controller4.delete_vector_by_name_id, 2)

        # if name_id introduced correctly
        self.assertEqual(len(self.controller2), 3)
        self.controller2.delete_vector_by_name_id("V1")
        self.assertEqual(len(self.controller2), 2)

        # if name_id introduced correctly
        self.assertEqual(len(self.controller3), 4)
        self.controller3.delete_vector_by_name_id("SB")
        self.assertEqual(len(self.controller3), 3)

    def test_get_vectors_of_given_sum(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.get_vectors_of_given_sum, 5)

        # if sum introduced not as a number
        self.assertRaises(AttributeError, self.controller1.get_vectors_of_given_sum, "500Y")

        # if sum introduced not equal to any sum of any vector in the repository
        self.assertRaises(IndexError, self.controller4.get_vectors_of_given_sum, 1000)

        # sum introduced equal to the sum of one vector in the repository
        self.assertEqual(str(self.controller3.get_vectors_of_given_sum(17)),
                         str(VectorRepository([self.controller3.get_vector_at_index(2)])))

        # sum introduced equal to the sum of more than one vector in the repository
        self.assertEqual(str(self.controller2.get_vectors_of_given_sum(8)),
                         str(VectorRepository([
                             self.controller2.get_vector_at_index(0),
                             self.controller2.get_vector_at_index(2)
                         ])))

    def test_delete_vectors_between_indexes(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.delete_vectors_between_indexes, 0, 3)

        # if indexes out of range
        self.assertRaises(IndexError, self.controller1.delete_vectors_between_indexes, 9, 5)

        # if indexes introduced not as integers
        self.assertRaises(AttributeError, self.controller4.delete_vectors_between_indexes, "NotAValidIndex", 3)

        # indexes correctly introduced, one element deleted
        self.assertEqual(len(self.controller3), 4)
        self.controller3.delete_vectors_between_indexes(1, 1)
        self.assertEqual(len(self.controller3), 3)

        # indexes correctly introduced, more than one element deleted
        self.assertEqual(len(self.controller2), 3)
        self.controller2.delete_vectors_between_indexes(0, 1)
        self.assertEqual(len(self.controller2), 1)

        # indexes introduced in inverse order, more than one element deleted
        self.assertEqual(len(self.controller3), 3)
        self.controller3.delete_vectors_between_indexes(0, 1)
        self.assertEqual(len(self.controller3), 1)

    def test_update_vector_color_by_name_id(self):
        # if empty repository
        self.assertRaises(IndexError, self.controller0.update_vector_color_by_name_id, "V1", "r")

        # if name_id non existent in the repository
        self.assertRaises(IndexError, self.controller1.update_vector_color_by_name_id, "NotAnExistentNameId", "r")

        # if color introduced is not a valid color
        self.assertRaises(AttributeError, self.controller4.update_vector_color_by_name_id, "I", "NotAValidColor")

        # if name_id and color correctly introduced
        self.assertEqual(str(self.controller2.get_vector_of_name_id("V1")),
                         "Vector V1 of color r and type 2 with values: [1 3 4]")
        self.controller2.update_vector_color_by_name_id("V1", "m")
        self.assertEqual(str(self.controller2.get_vector_of_name_id("V1")),
                         "Vector V1 of color m and type 2 with values: [1 3 4]")

        # if name_id and color correctly introduced
        self.assertEqual(str(self.controller3.get_vector_of_name_id("SA")),
                         "Vector SA of color r and type 2 with values: [1 3 4.5]")
        self.controller3.update_vector_color_by_name_id("SA", "y")
        self.assertEqual(str(self.controller3.get_vector_of_name_id("SA")),
                         "Vector SA of color y and type 2 with values: [1 3 4.5]")
