from unittest import TestCase
from domain.passenger import Passenger
from domain.plane import Plane


class PlaneTest(TestCase):

    # 1st. Iteration
    # Tested the create, set and get operations
    # Also add, get, update, delete passengers

    def setUp(self):
        self.plane1 = Plane("IB1", "BestAir", 20, "Ibiza",
                            [
                                Passenger("Jake", "Garcia", "JG123"),
                                Passenger("John", "Mayer", "JM123"),
                                Passenger("Robert", "Smith", "RS123")
                            ])

        self.plane2 = Plane("IB2", "NextAir", 10, "Tel Aviv",
                            [
                                Passenger("Jake", "Garcia", "JG123"),
                                Passenger("Oliver", "Brown", "OB123"),
                                Passenger("William", "Anderson", "WA123")
                            ])

    def test_create(self):
        # creating a plane with wrong data
        self.assertRaises(IndexError, Plane, "", "", 0, "", [])

        self.assertRaises(AttributeError, Plane, "IB1", "BestAir", "3", "Ibiza", [Passenger("Jake", "Garcia", "JG123")])

        # creating a plane with correct data
        self.plane = Plane("IB1", "BestAir", 3, "Ibiza", [Passenger("Jake", "Garcia", "JG123")])
        self.assertEqual(self.plane.get_name(), "IB1")

    def test_getters(self):
        self.plane = Plane("IB1", "BestAir", 3, "Ibiza", [Passenger("Jake", "Garcia", "JG123")])

        # getting the id
        self.assertEqual(self.plane.get_name(), "IB1")

        # getting the airline company
        self.assertEqual(self.plane.get_airline(), "BestAir")

        # getting the destination
        self.assertEqual(self.plane.get_destination(), "Ibiza")

    def test_setters(self):
        self.plane = Plane("IB1", "BestAir", 3, "Ibiza", [Passenger("Jake", "Garcia", "JG123")])

        # setting the airline company
        self.assertEqual(self.plane.get_airline(), "BestAir")
        self.plane.set_airline("BestBestAir")
        self.assertEqual(self.plane.get_airline(), "BestBestAir")

        # setting the destination
        self.assertEqual(self.plane.get_destination(), "Ibiza")
        self.plane.set_destination("Bucharest")
        self.assertEqual(self.plane.get_destination(), "Bucharest")

        # setting the number of seats with wrong data
        self.assertRaises(AttributeError, self.plane.set_seats, "Not an integer")

    def test_add_passenger(self):
        # adding a new passenger with correct data
        self.assertEqual(len(self.plane1.get_passengers()), 3)
        self.plane1.add_passenger("Mike", "Mayers", "MM123")
        self.assertEqual(len(self.plane1.get_passengers()), 4)

        # trying to add an existing passenger
        self.assertRaises(IndexError, self.plane1.add_passenger, "Jake", "Garcia", "JG123")

        # trying to add a passenger with wrong passport number
        self.assertRaises(AttributeError, self.plane1.add_passenger, "Mike", "Mayers", "FF000")

    def test_get_passenger(self):
        # getting a passenger with correct data
        passengers = self.plane1.get_passengers()
        passenger = passengers[0]
        self.assertEqual(self.plane1.get_passenger("JG123"), passenger)

        # trying to get a non-existent passenger
        self.assertRaises(IndexError, self.plane1.get_passenger, "FF000")

        # trying to get a passenger with wrong data
        self.assertRaises(IndexError, self.plane1.get_passenger, "Mike")

    def test_update_passenger(self):
        # updating a passenger with correct data
        self.plane1.update_passenger("JG123", "Mike", "Mayers", "MM123")
        passengers = self.plane1.get_passengers()
        passenger = passengers[0]
        self.assertEqual(passenger.get_first_name(), "MIKE")

        # trying to update a non-existent passenger
        self.assertRaises(IndexError, self.plane1.update_passenger, "FF000", "Mike", "Mayers", "MM123")

        # trying to update a passenger with wrong data
        self.assertRaises(IndexError, self.plane1.update_passenger, 1, 2, 3, 4)

    def test_delete_passenger(self):
        # trying to delete a non-existent passenger
        self.assertRaises(IndexError, self.plane1.delete_passenger, "FF000")

        # trying to delete a passenger with wrong data
        self.assertRaises(IndexError, self.plane1.delete_passenger, 1)

        # delete a passenger with correct data
        self.assertEqual(len(self.plane1.get_passengers()), 3)
        self.plane1.delete_passenger("JM123")
        self.assertEqual(len(self.plane1.get_passengers()), 2)
