from unittest import TestCase
from domain.passenger import Passenger
from domain.plane import Plane
from infrastructure.airport import Airport


class AirportTest(TestCase):

    # 1st. Iteration
    # Tested the CRUD operations

    def setUp(self):
        self.airport0 = Airport

        self.airport1 = Airport([
            Plane("NN0", "NuoNeoAir", 20, "Bucharest", [
                Passenger("Paul", "Pop", "PP123"),
                Passenger("Alex", "Bob", "AB123"),
                Passenger("Robert", "Smith", "RS123")
            ])
            ])

        self.airport2 = Airport([
            Plane("IB1", "BestAir", 15, "Ibiza", [
                Passenger("Jake", "Garcia", "JG123"),
                Passenger("John", "Mayer", "JM123"),
                Passenger("Robert", "Smith", "RS123")
            ]),
            Plane("IB2", "BestAir", 30, "Tel Aviv", [
                Passenger("Jake", "Garcia", "JG123"),
                Passenger("Oliver", "Brown", "OB123"),
                Passenger("William", "Anderson", "WA123"),
                Passenger("Robert", "Smith", "RS123"),
                Passenger("Alex", "Bob", "AB123"),
            ]),
            ])

        self.airport3 = Airport([
            Plane("NA1", "NextAir", 36, "Tel Aviv", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("William", "Anderson", "WA456")
            ]),
            Plane("NA2", "NextAir", 20, "Spain", [
                Passenger("William", "Anderson", "WA456"),
                Passenger("Willie", "Jameson", "WJ456")
            ])
            ])

        self.airport4 = Airport([
            Plane("VA1", "VAir", 36, "Tel Aviv", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("William", "Anderson", "WA456")
            ]),
            Plane("CA2", "CAir", 20, "Tel Aviv", [
                Passenger("William", "Anderson", "WA456"),
                Passenger("Willie", "Jameson", "WJ456")
            ])
            ])

    def test_create(self):
        # creating an airport with identical planes
        self.assertRaises(IndexError, Airport, [
            Plane("IB1", "BestAir", 3, "Ibiza", [
                Passenger("Jake", "Garcia", "JG123"),
            ]),
            Plane("IB1", "BestAir", 3, "Ibiza", [
                Passenger("Jake", "Garcia", "JG123"),
            ])
        ])

        # non-empty airport
        self.assertEqual(len(self.airport1), 1)
        self.assertEqual(len(self.airport2), 2)

    def test_get_passengers_from_plane(self):
        # non-existing plane
        self.assertRaises(IndexError, self.airport1.get_passengers_from_plane, "non-existing plane")

        # existing plane
        self.assertTrue(self.airport1.get_passengers_from_plane, "NN0")

        # existing plane
        self.assertTrue(self.airport3.get_passengers_from_plane, "NA2")

    def test_add_passenger_to_plane(self):
        # non-existing plane
        self.assertRaises(IndexError, self.airport1.add_passenger_to_plane, "non-existing plane",
                          "First Name", "Last Name", "Passport Number")

        # trying to add an existing passenger in an existing plane
        self.assertRaises(IndexError, self.airport1.add_passenger_to_plane, "NN0", "Paul", "Pop", "PP123")

        # existing plane and new passenger
        self.assertTrue(self.airport3.add_passenger_to_plane("NA2", "Paul", "Pop", "PP123"))

    def test_update_passenger_in_plane(self):
        # trying to update in an non-existing plane
        self.assertRaises(IndexError, self.airport1.update_passenger_in_plane, "non-existing plane",
                          "Passport Number", "First Name", "Last Name", "Passport Number")

        # trying to update a non-existing plane passenger in an existing plane
        self.assertRaises(IndexError, self.airport1.update_passenger_in_plane, "NN0", "JG123", "Paul", "Pop", "PP123")

        # existing plane and existing passenger
        self.assertTrue(self.airport3.update_passenger_in_plane("NA2",  "WA456", "Paul", "Pop", "PP123"))

    def test_delete_passenger_in_plane(self):
        # non-existing plane
        self.assertRaises(IndexError, self.airport1.delete_passenger_in_plane, "Non-existing Plane", "Passport Number")

        # non-existing passenger
        self.assertRaises(IndexError, self.airport1.delete_passenger_in_plane, "NN0", "Not a Passport Number")

        # existing plane and passenger
        self.assertEqual(len(self.airport1.get_plane_of_name("NN0").get_passengers()), 3)
        self.airport1.delete_passenger_in_plane("NN0", "PP123")
        self.assertEqual(len(self.airport1.get_plane_of_name("NN0").get_passengers()), 2)

    def test_add_plane(self):
        # adding a plane that's already in the airport
        self.assertRaises(IndexError, self.airport1.add_plane, "NN0", "NuoNeoAir", 3, "Bucharest",
                            [
                                Passenger("Paul", "Pop", "PP123"),
                                Passenger("Alex", "Bob", "AB123"),
                                Passenger("Robert", "Smith", "RS123")
                            ])

        # adding a plane with wrong data
        self.assertRaises(IndexError, self.airport1.add_plane, "", "BlueAir", 100, "Ibiza",
                          [Passenger("Paul", "Pop", "PP123")])

        # adding a plane with correct data
        self.assertEqual(len(self.airport1), 1)
        self.airport1.add_plane("IB1", "BestAir", 3, "Ibiza", [Passenger("Jake", "Garcia", "JG123")])
        self.assertEqual(len(self.airport1), 2)

    def test_update_plane(self):
        # index given not in bounds
        self.assertEqual(len(self.airport1), 1)
        self.assertRaises(IndexError, self.airport1.update_plane, 100, "V1", "BlueAir", 45, "Ibiza",
                          [Passenger("Paul", "Pop", "PP123")])

        # updating a plane's name with the name of an existing plane
        self.assertEqual(len(self.airport2), 2)
        self.assertRaises(AssertionError, self.airport2.update_plane, 1, "IB1", "BlueAir", 45, "Ibiza",
                          [Passenger("Paul", "Pop", "PP123")])

    def test_delete_plane(self):
        # index given not in bounds
        self.assertEqual(len(self.airport1), 1)
        self.assertRaises(IndexError, self.airport1.delete_plane, 100)

        # index given not an integer
        self.assertRaises(AttributeError, self.airport1.delete_plane, "Not an integer")

        # deleting a plane with correct data
        self.assertEqual(len(self.airport2), 2)
        self.airport2.delete_plane(0)
        self.assertEqual(len(self.airport1), 1)

    # 2nd. Iteration
    # Tested the Sort/Search/Filter operations

    def test_sort_passengers(self):
        # passengers not in alphabetical order
        plane = self.airport1.get_plane_of_name("NN0")
        passenger1 = plane.get_passenger_of_index(0)
        self.assertEqual("POP", passenger1.get_last_name())
        self.airport1.sort_passengers_by_last_name("NN0")
        passenger1 = plane.get_passenger_of_index(0)
        self.assertEqual("BOB", passenger1.get_last_name())

        # passengers in alphabetical order
        plane = self.airport2.get_plane_of_name("IB1")
        passenger1 = plane.get_passenger_of_index(0)
        self.assertEqual("GARCIA", passenger1.get_last_name())
        self.airport2.sort_passengers_by_last_name("IB1")
        passenger1 = plane.get_passenger_of_index(0)
        self.assertEqual("GARCIA", passenger1.get_last_name())

        # name of plane non-existent
        self.assertRaises(AssertionError, self.airport2.sort_passengers_by_last_name, "NotAnExistentNameOfPlane")

    def test_sort_planes_by_number_of_passengers(self):
        # planes not in order of the number of passengers
        self.assertEqual("IB1", self.airport2.get_plane_at_index(0).get_name())
        self.airport2.sort_planes_by_number_of_passengers()
        self.assertEqual("IB2", self.airport2.get_plane_at_index(0).get_name())

        # planes in order of the number of passengers
        self.assertEqual(self.airport3.get_plane_of_name("NA1"), self.airport3.get_plane_at_index(0))
        self.airport3.sort_planes_by_number_of_passengers()
        self.assertEqual(self.airport3.get_plane_of_name("NA1"), self.airport3.get_plane_at_index(0))

        # planes in order of the number of passengers
        self.assertEqual(self.airport1.get_plane_of_name("NN0"), self.airport1.get_plane_at_index(0))
        self.airport1.sort_planes_by_number_of_passengers()
        self.assertEqual(self.airport1.get_plane_of_name("NN0"), self.airport1.get_plane_at_index(0))

    def test_sort_planes_by_passengers_with_name(self):
        # test for airport 1
        self.assertEqual("NN0", self.airport1.get_plane_at_index(0).get_name())
        self.airport1.sort_planes_by_passengers_with_name("J")
        self.assertEqual("NN0", self.airport1.get_plane_at_index(0).get_name())

        # test for airport 2
        self.assertEqual("IB1", self.airport2.get_plane_at_index(0).get_name())
        self.airport2.sort_planes_by_passengers_with_name("OLIVER")
        self.assertEqual("IB2", self.airport2.get_plane_at_index(0).get_name())

        # test for airport 3
        self.assertEqual("NA1", self.airport3.get_plane_at_index(0).get_name())
        self.airport3.sort_planes_by_passengers_with_name("WILL")
        self.assertEqual("NA2", self.airport3.get_plane_at_index(0).get_name())

    def test_sort_planes_by_passengers_and_destination(self):
        # test for airport 1
        self.assertEqual("NN0", self.airport1.get_plane_at_index(0).get_name())
        self.airport1.sort_planes_by_passengers_and_destination()
        self.assertEqual("NN0", self.airport1.get_plane_at_index(0).get_name())

        # test for airport 2
        self.assertEqual("IB1", self.airport2.get_plane_at_index(0).get_name())
        self.airport2.sort_planes_by_passengers_and_destination()
        self.assertEqual("IB2", self.airport2.get_plane_at_index(0).get_name())

        # test for airport 3
        self.assertEqual("NA1", self.airport3.get_plane_at_index(0).get_name())
        self.airport3.sort_planes_by_passengers_and_destination()
        self.assertEqual("NA1", self.airport3.get_plane_at_index(0).get_name())

    def test_planes_with_passengers_with_passport(self):
        # test for airport 1
        self.assertEqual(len(self.airport1.get_planes_with_passengers_with_passport("P", "P", "1")), 1)

        # test for airport 2
        self.assertEqual(len(self.airport2.get_planes_with_passengers_with_passport("J", "G", "1")), 2)

        # test for airport 3
        self.assertEqual(len(self.airport3.get_planes_with_passengers_with_passport("W", "A", "4")), 2)

    def test_get_plane_passengers_with_string_in_name(self):
        # test for airport 1
        self.assertEqual(len(self.airport1.get_plane_passengers_with_string_in_name("NN0", "A")), 2)

        # test for airport 2
        self.assertEqual(len(self.airport2.get_plane_passengers_with_string_in_name("IB2", "BR")), 1)

        # test for airport 3
        self.assertEqual(len(self.airport3.get_plane_passengers_with_string_in_name("NA2", "WILL")), 2)

    def test_get_planes_with_passenger(self):
        # test for airport 1
        self.assertEqual(len(self.airport1.get_planes_with_passenger("Pop")), 1)

        # test for airport 2
        self.assertEqual(len(self.airport2.get_planes_with_passenger("GARCIA")), 2)

        # test for airport 3
        self.assertEqual(len(self.airport3.get_planes_with_passenger("WILLIAM")), 2)

    # 3rd. Iteration
    # Tested the group generation (backtracking) operations

    def test_groups_of_passengers_in_plane_with_different_last_names(self):
        # test for airport 1
        groups = self.airport1.groups_of_passengers_in_plane_with_different_last_names("NN0", 2)
        self.assertEqual(len(groups), 6)

        # test for airport 2
        groups = self.airport2.groups_of_passengers_in_plane_with_different_last_names("IB2", 3)
        self.assertEqual(len(groups), 60)

        # test for airport 3
        groups = self.airport3.groups_of_passengers_in_plane_with_different_last_names("NA2", 1)
        self.assertEqual(len(groups), 2)

    def test_groups_of_planes_with_same_destination_belonging_different_companies(self):
        # test for airport 1
        groups = self.airport1.groups_of_planes_with_same_destination_belonging_different_companies(1)
        self.assertEqual(len(groups), 1)

        # test for airport 3
        self.assertRaises(IndexError,
                          self.airport3.groups_of_planes_with_same_destination_belonging_different_companies, 2)

        # test for airport 4
        groups = self.airport4.groups_of_planes_with_same_destination_belonging_different_companies(1)
        self.assertEqual(len(groups), 2)
