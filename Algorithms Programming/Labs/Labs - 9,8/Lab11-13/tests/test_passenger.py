from unittest import TestCase
from domain.passenger import Passenger


class PassengerTest(TestCase):

    # 1st. Iteration
    # Tested the create, set and get operations

    def setUp(self):
        self.passenger1 = Passenger("Jake", "Garcia", "JG123")
        self.passenger2 = Passenger("John", "Mayer", "JM123")
        self.passenger3 = Passenger("Robert", "Smith", "RS123")
        self.passenger4 = Passenger("Oliver", "Brown", "OB123")
        self.passenger5 = Passenger("William", "Anderson", "WA123")

    def test_create(self):
        # creating a passenger with empty data
        self.assertRaises(IndexError, Passenger, "", "", "")

        # creating a passenger with wrong data
        self.assertRaises(AttributeError, Passenger, "1", "2", "12345")

        # creating a passenger with wrong name
        self.assertRaises(AttributeError, Passenger, "1", "Smith", "1S345")

    def test_getters(self):
        self.passenger = Passenger("Jake", "Garcia", "JG123")

        # getting the first name
        self.assertEqual(self.passenger.get_first_name(), "JAKE")

        # getting the last name
        self.assertEqual(self.passenger.get_last_name(), "GARCIA")

        # getting the passport number
        self.assertEqual(self.passenger.get_passport_num(), "JG123")

    def test_setters(self):
        self.passenger = Passenger("Jake", "Garcia", "JG123")

        # setting the first name
        self.assertEqual(self.passenger.get_first_name(), "JAKE")
        self.passenger.set_first_name("MIKE")
        self.assertEqual(self.passenger.get_first_name(), "MIKE")

        # setting the last name
        self.assertEqual(self.passenger.get_last_name(), "GARCIA")
        self.passenger.set_last_name("SMITH")
        self.assertEqual(self.passenger.get_last_name(), "SMITH")

        # setting the passport number with wrong data
        self.assertRaises(AttributeError, self.passenger.set_passport_num, "NOT A CORRECT PASSPORT NUMBER")

