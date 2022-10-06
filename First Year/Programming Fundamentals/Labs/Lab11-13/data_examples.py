from application.airport_controller import AirportController
from infrastructure.airport import Airport
from domain.plane import Plane
from domain.passenger import Passenger

if __name__ == "__main__":
    controller = AirportController(
        Airport([
            Plane("BA1", "BestAir", 30, "Ibiza", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("John", "Mayer", "JM553"),
                Passenger("Robert", "Smith", "RS229"),
                Passenger("Jake", "Garcia", "JG053"),
            ]),
            Plane("BA2", "BestAir", 25, "Cluj", [
                Passenger("Maddie", "Reynolds", "MR101"),
                Passenger("Brett", "White", "BW111"),
                Passenger("Robert", "Smith", "RS229")
            ]),
            Plane("NA36", "NextAir", 36, "Cluj", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("William", "Anderson", "WA456")
            ]),

            Plane("NA20", "NextAir", 20, "Brazil", [
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("William", "Anderson", "WA456")
            ]),

            Plane("BW15", "BlueWave", 15, "Cluj", [
                Passenger("Aaron", "Hank", "AH952"),
                Passenger("Abigail", "Douglas", "AD111")
            ]),

            Plane("MA21", "MaxAir", 21, "Roma", [
                Passenger("Alexandra", "Hatfield", "AH333"),
                Passenger("Brett", "White", "BW111")
            ]),

            Plane("BW30", "BlueWave", 30, "Brazil", [
                Passenger("Alexandra", "Hatfield", "AH333"),
                Passenger("Marian", "Jackson", "MJ872"),
                Passenger("Brett", "White", "BW111"),
                Passenger("Jake", "Garcia", "JG003")
            ]),

            Plane("BW23", "BlueWave", 23, "Roma", [
                Passenger("John", "Foster", "JF333"),
                Passenger("Elizabeth", "Ansel", "EA872"),
                Passenger("George", "Ansel", "GA111"),
                Passenger("Whitman", "Walt", "WW345")
            ]),

            Plane("TA01", "Tacom", 35, "Cluj", [
                Passenger("Paul", "Pop", "PP123"),
                Passenger("Alex", "Bob", "AB123"),
                Passenger("Robert", "Crainic", "RC123"),
                Passenger("Dan", "Cantor", "DC123"),
                Passenger("Vlad", "Oprea", "VO123"),
                Passenger("George", "Ansel", "GA111"),
                Passenger("Alexandra", "Hatfield", "AH333")
            ]),

            Plane("TA02", "Tacom", 25, "Roma", [
                Passenger("Paul", "Pop", "PP123"),
                Passenger("Roberta", "Kerekes", "RK003"),
                Passenger("Alexandru", "Stezar", "AS003")
            ]),
        ]))

    # 1st. Iteration

    # print airport
    print(controller)
    print("-" * 100)
    print("\n")

    # add plane to airport
    print("Add plane to airport:\n")
    controller.add_plane("VA1", "VAir", 5, "Costa Rica", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("Paul", "Pop", "PP123"),
                Passenger("William", "Anderson", "WA456")
            ])
    print(controller)
    print("-" * 100)
    print("\n")

    # print plane by name
    print("Get plane from airport by name:\n")
    print(controller.get_plane_of_name("VA1"))
    print("-" * 100)
    print("\n")

    # print plane by index
    print("Get plane from airport by index:\n")
    print(controller.get_plane_at_index(3))
    print("-" * 100)
    print("\n")

    # add passenger to plane from airport
    print("Add passenger to plane from airport:\n")
    print("BEFORE:")
    print(controller.get_plane_of_name("VA1"))
    passengers_list = controller.add_passenger_to_plane("VA1", "Alexandra", "Hatfield", "AH333")
    print("AFTER:")
    print(controller.get_plane_of_name("VA1"))
    print("-" * 100)
    print("\n")

    # print passengers from plane from airport
    print("Print passengers from plane from airport:\n")
    passengers_list = controller.get_passengers_from_plane("VA1")
    print("Passengers:")
    for passenger in passengers_list:
        string = f"First Name: {passenger.get_first_name()} || "
        string += f"Last Name: {passenger.get_last_name()} || "
        string += f"Passport number: {passenger.get_passport_num()}"
        print(string)
    print("\n")
    print("-" * 100)
    print("\n")

    # update plane
    print("Update plane from airport:\n")
    print("BEFORE:")
    print(controller.get_plane_at_index(10))
    controller.update_plane(10, "VA1.0", "VAir", 5, "Rio", [
            Passenger("Alexandra", "Hatfield", "AH333"),
            Passenger("Marian", "Jackson", "MJ872"),
            Passenger("Brett", "White", "BW111"),
            Passenger("Jake", "Garcia", "JG003")
        ])
    print("AFTER:")
    print(controller.get_plane_at_index(10))
    print("-" * 100)
    print("\n")

    # update passenger in plane from airport
    print("Update passenger in plane from airport:\n")
    print("BEFORE:")
    plane = controller.get_plane_of_name("VA1.0")
    passenger = plane.get_passenger("JG003")
    string = f"First Name: {passenger.get_first_name()} || "
    string += f"Last Name: {passenger.get_last_name()} || "
    string += f"Passport number: {passenger.get_passport_num()}"
    print(f"{string}\n")
    passenger = controller.update_passenger_in_plane("VA1.0", "JG003",
                                                     "Jackson", "Gardie", "JG003")
    print("AFTER:")
    string = f"First Name: {passenger.get_first_name()} || "
    string += f"Last Name: {passenger.get_last_name()} || "
    string += f"Passport number: {passenger.get_passport_num()}"
    print(f"{string}\n")
    print("-" * 100)
    print("\n")

    # delete plane
    print("Delete plane from airport:\n")
    print("BEFORE:\n")
    print(controller)
    controller.delete_plane(10)
    print("AFTER:")
    print(controller)
    print("-" * 100)
    print("\n")

    # delete passenger in plane from airport
    print("Delete passenger in plane from airport:\n")
    print("BEFORE:\n")
    print(controller.get_plane_of_name("TA01"))
    controller.delete_passenger_in_plane("TA01", "RC123")
    print("AFTER:")
    print(controller.get_plane_of_name("TA01"))
    print("-" * 100)
    print("\n")

    # 2nd. Iteration

    # sort the passengers in a plane by last name
    print("Sort the passengers in a plane by last name:\n")
    print("BEFORE:\n")
    print(controller.get_plane_of_name("TA01"))
    controller.sort_passengers_by_last_name("TA01")
    print("AFTER:")
    print(controller.get_plane_of_name("TA01"))
    print("\n")

    # sort the passengers in a plane by last name
    print("BEFORE:\n")
    print(controller.get_plane_of_name("TA02"))
    controller.sort_passengers_by_last_name("TA02")
    print("AFTER:")
    print(controller.get_plane_of_name("TA02"))
    print("-" * 100)
    print("\n")

    # sort planes according to the number of passengers
    print("BEFORE:\n")
    print(controller)
    controller.sort_planes_by_number_of_passengers()
    print("AFTER:")
    print(controller)
    print("-" * 100)
    print("\n")

    # sort planes according to the number of passengers with the first name starting with a given substring
    print("BEFORE:\n")
    print(controller)
    controller.sort_planes_by_passengers_with_name("J")
    print("AFTER:")
    print(controller)
    print("-" * 100)
    print("\n")

    # sort planes according to the string obtained by concatenation
    # of the number of passengers in the plane and the destination
    print("BEFORE:\n")
    print(controller)
    controller.sort_planes_by_passengers_and_destination()
    print("AFTER:")
    print(controller)
    print("-" * 100)
    print("\n")

    # identify planes that have passengers with passport numbers starting with the same 3 letters
    print("Identify planes that have passengers with passport numbers starting with the same 3 letters:\n")
    planes = controller.get_planes_with_passengers_with_passport("J", "G", "0")
    print("Planes:")
    for plane in planes:
        string = f"Plane: {plane.get_name()} \n"
        string += f"Airline: {plane.get_airline()} \n"
        string += f"Seats: {plane.get_seats()} \n"
        string += f"Destination: {plane.get_destination()} \n"
        print(string)
    print("-" * 100)
    print("\n")

    # identify passengers from a given plane for which the first name or last name contain a string given as parameter
    print("Identify passengers from a given plane for which the first name or last name "
          "contain a string given as parameter:\n")
    passengers_list = controller.get_plane_passengers_with_string_in_name("BA1", "oh")
    print("Planes:")
    for passenger in passengers_list:
        string = f"First Name: {passenger.get_first_name()} || "
        string += f"Last Name: {passenger.get_last_name()} || "
        string += f"Passport number: {passenger.get_passport_num()}"
        print(string)
    print("-" * 100)
    print("\n")

    # identify plane/planes where there is a passenger with given name
    print("Identify plane/planes where there is a passenger with given name:\n")
    planes = controller.get_planes_with_passenger("JOHN")
    print("\nPlanes:")
    for plane in planes:
        string = f"Plane: {plane.get_name()} \n"
        string += f"Airline: {plane.get_airline()} \n"
        string += f"Seats: {plane.get_seats()} \n"
        string += f"Destination: {plane.get_destination()} \n"
        print(string)
    print("-" * 100)
    print("\n")

    # 3rd. Iteration

    # form groups of k passengers from the same plane but with different last names
    print("Form groups of k passengers from the same plane but with different last names.\n")
    print("\nGroups of 2:\n")
    group_list = controller.groups_of_passengers_in_plane_with_different_last_names("TA01", 2)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.")
        index += 1
        for passenger in group:
            string = f"First Name: {passenger.get_first_name()} || "
            string += f"Last Name: {passenger.get_last_name()} || "
            string += f"Passport number: {passenger.get_passport_num()}"
            print(string)
        print("\n")

    print("\nGroups of 3:\n")
    group_list = controller.groups_of_passengers_in_plane_with_different_last_names("TA01", 3)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.")
        index += 1
        for passenger in group:
            string = f"First Name: {passenger.get_first_name()} || "
            string += f"Last Name: {passenger.get_last_name()} || "
            string += f"Passport number: {passenger.get_passport_num()}"
            print(string)
        print("\n")

    print("\nGroups of 4:\n")
    group_list = controller.groups_of_passengers_in_plane_with_different_last_names("TA01", 4)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.")
        index += 1
        for passenger in group:
            string = f"First Name: {passenger.get_first_name()} || "
            string += f"Last Name: {passenger.get_last_name()} || "
            string += f"Passport number: {passenger.get_passport_num()}"
            print(string)
        print("\n")

    print("\nGroups of 5:\n")
    group_list = controller.groups_of_passengers_in_plane_with_different_last_names("TA01", 5)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.")
        index += 1
        for passenger in group:
            string = f"First Name: {passenger.get_first_name()} || "
            string += f"Last Name: {passenger.get_last_name()} || "
            string += f"Passport number: {passenger.get_passport_num()}"
            print(string)
        print("\n")

    print("-" * 100)
    print("\n")

    # form groups of k planes with the same destination but belonging to different airline companies
    print("Form groups of k planes with the same destination "
          "but belonging to different airline companies.\n")

    print("\nGroups of 2:\n")
    group_list = controller.groups_of_planes_with_same_destination_belonging_different_companies(2)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.\n")
        index += 1
        for plane in group:
            string = f"Plane: {plane.get_name()} \n"
            string += f"Airline: {plane.get_airline()} \n"
            string += f"Seats: {plane.get_seats()} \n"
            string += f"Destination: {plane.get_destination()} \n"
            print(string)
        print("\n")
    print("-" * 100)
    print("\n")

    print("\nGroups of 3:\n")
    group_list = controller.groups_of_planes_with_same_destination_belonging_different_companies(3)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.\n")
        index += 1
        for plane in group:
            string = f"Plane: {plane.get_name()} \n"
            string += f"Airline: {plane.get_airline()} \n"
            string += f"Seats: {plane.get_seats()} \n"
            string += f"Destination: {plane.get_destination()} \n"
            print(string)
        print("\n")
    print("-" * 100)
    print("\n")

    print("\nGroups of 4:\n")
    group_list = controller.groups_of_planes_with_same_destination_belonging_different_companies(4)
    index = 1
    for group in group_list:
        print(f"\nGroup {index}.\n")
        index += 1
        for plane in group:
            string = f"Plane: {plane.get_name()} \n"
            string += f"Airline: {plane.get_airline()} \n"
            string += f"Seats: {plane.get_seats()} \n"
            string += f"Destination: {plane.get_destination()} \n"
            print(string)
        print("\n")
    print("-" * 100)
    print("\n")
