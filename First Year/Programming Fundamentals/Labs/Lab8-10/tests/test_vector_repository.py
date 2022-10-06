from unittest import TestCase
from domain.vector_model import MyVector
from infrastructure.vector_repository import VectorRepository


class VectorRepositoryTest(TestCase):
    """
    Tested the constructor, the getter and setter methods. Tested other functionalities in the controller.
    """

    def setUp(self):
        self.vectors0 = VectorRepository()
        self.vectors1 = VectorRepository([
            MyVector("V1", "r", 2, [1, 3, 4])
        ])
        self.vectors2 = VectorRepository([
            MyVector("V1", "r", 2, [1, 3, 4]),
            MyVector("V2", "m", 3, [2, 6, 9]),
            MyVector("V3", "r", 2, [1])
        ])
        self.vectors3 = VectorRepository([
            MyVector("SA", "r", 2, [1]),
            MyVector("SB", "m", 3, [2.23, 6.45, 9.34]),
            MyVector("SC", "b", 1, [1, 9, 7]),
            MyVector("SD", "y", 9, [4.5, 2.8])
        ])
        self.vectors4 = VectorRepository([
            MyVector("I", "r", 2, [1, 3, 4.5]),
            MyVector("K", "m", 3, [2.23]),
            MyVector("2", "m", 3, [6.45, 9.34])
        ])

    def test_create(self):
        self.assertRaises(IndexError, self.vectors0.get_all_vectors)
        self.assertRaises(IndexError, VectorRepository, [
            MyVector("SA", "r", 2, [1, 3, 4.5]),
            MyVector("SA", "r", 2, [1, 3, 4.5])
        ])
        self.assertEqual(str(self.vectors1),    "Vectors: \n"
                                                "Vector V1 of color r and type 2 with values: [1 3 4]\n")

        self.assertEqual(str(self.vectors2),    "Vectors: \n"
                                                "Vector V1 of color r and type 2 with values: [1 3 4]\n"
                                                "Vector V2 of color m and type 3 with values: [2 6 9]\n"
                                                "Vector V3 of color r and type 2 with values: [1]\n")

        self.assertEqual(str(self.vectors4),    "Vectors: \n"
                                                "Vector I of color r and type 2 with values: [1 3 4.5]\n"
                                                "Vector K of color m and type 3 with values: [2.23]\n"
                                                "Vector 2 of color m and type 3 with values: [6.45 9.34]\n")

    def test_len(self):
        self.assertEqual(len(self.vectors0), 0)
        self.assertEqual(len(self.vectors1), 1)
        self.assertEqual(len(self.vectors2), 3)
        self.assertEqual(len(self.vectors3), 4)
        self.assertEqual(len(self.vectors4), 3)