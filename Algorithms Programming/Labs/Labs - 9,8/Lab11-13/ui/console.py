from domain.passenger import Passenger
from application.airport_controller import AirportController


def print_menu():
    """
    Print the menu options available in the interface.
    :return:
    """
    print("Application Commands:\n")

    print("EXIT = Exit program.")
    print("MENU = Show menu.")

    print("\nCRUD on planes")
    print("1.0 = Get the passengers from a plane in the airport.")
    print("1.1 = Add a passenger to a plane in the airport.")
    print("1.2 = Update a passenger from a plane in the airport.")
    print("1.3 = Delete a passenger from a plane in the airport.")

    print("\nCRUD on airport")
    print("2.0 = Get all the planes in the airport.")
    print("2.1 = Add a plane to the airport.")
    print("2.2 = Update a plane from the airport by index.")
    print("2.3 = Delete a plane from the airport by index.")

    print("\nSort")
    print("3 = Sort the passengers in a plane by last name.")
    print("4 = Sort planes according to the number of passengers.")
    print("5 = Sort planes according to the number of passengers with the first name starting with a given substring.")
    print("6 = Sort planes according to the string obtained by concatenation of "
          "the number of passengers in the plane and the destination.")

    print("\nSearch")
    print("7 = Identify planes that have passengers with passport numbers starting with the same 3 letters.")
    print("8 = Identify passengers from a given plane for which the first name or last name."
          "contain a string given as parameter.")
    print("9 = Identify plane/planes where there is a passenger with given name.")

    print("\nGroup Generation")
    print("10 = Form groups of k passengers from the same plane but with different last names.")
    print("11 = Form groups of k planes with the same destination but belonging to different airline companies.")


def start(controller: AirportController):
    """
    Start the menu type console.
    :return:
    """
    print_menu()
    command = input(">>> ")

    while command != "EXIT":
        if command == "MENU":
            print_menu()

        elif command == "1.0":
            try:
                print(f"\nGet the passengers from a plane in the airport.")
                name = input("\nPlane Name :  ")
                passengers_list = controller.get_passengers_from_plane(name)
                print("\nPassengers:")
                for passenger in passengers_list:
                    string = f"First Name: {passenger.get_first_name()} || "
                    string += f"Last Name: {passenger.get_last_name()} || "
                    string += f"Passport number: {passenger.get_passport_num()}"
                    print(string)
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "1.1":
            try:
                print(f"\nAdd a passenger to a plane in the airport.")
                name = input("\nPlane Name :  ")
                first_name = input("First Name :  ")
                last_name = input("Last Name :  ")
                passport_num = input("Passport Number :  ")
                passengers_list = controller.add_passenger_to_plane(name, first_name, last_name, passport_num)
                print("\nPassengers:")
                for passenger in passengers_list:
                    string = f"First Name: {passenger.get_first_name()} || "
                    string += f"Last Name: {passenger.get_last_name()} || "
                    string += f"Passport number: {passenger.get_passport_num()}"
                    print(string)
                print("Passenger Added!\n")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "1.2":
            try:
                print(f"\nUpdate a passenger from a plane in the airport.")
                name = input("\nPlane Name :  ")
                curr_passport_num = input("Passport Number of the Passenger : ")
                first_name = input("\nNew First Name :  ")
                last_name = input("New Last Name :  ")
                passport_num = input("New Passport Number :  ")
                passenger = controller.update_passenger_in_plane(name, curr_passport_num,
                                                                 first_name, last_name, passport_num)
                print("\nPassenger Updated:")
                string = f"First Name: {passenger.get_first_name()} || "
                string += f"Last Name: {passenger.get_last_name()} || "
                string += f"Passport number: {passenger.get_passport_num()}"
                print(f"{string}\n")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "1.3":
            try:
                print(f"\nDelete a passenger from a plane in the airport.")
                name = input("\nPlane Name :  ")
                passport_num = input("Passport Number of the Passenger :  ")
                passengers_list = controller.delete_passenger_in_plane(name, passport_num)
                print("\nCurrent Passengers:")
                for passenger in passengers_list:
                    string = f"First Name: {passenger.get_first_name()} || "
                    string += f"Last Name: {passenger.get_last_name()} || "
                    string += f"Passport number: {passenger.get_passport_num()}"
                    print(string)
                print("\nPassenger Deleted Successfully!")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "2.0":
            try:
                print(f"\n{controller}")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "2.1":
            try:
                print(f"\nAdd a plane to the airport.")
                name = input("\nPlane Name :  ")
                airline = input("Plane Airline : ")
                seats = int(input("Seats : "))
                destination = input("Destination : ")
                nr = int(input("Number of passengers : "))
                passengers_list = []
                for index in range(nr):
                    passengers_list.append(Passenger(input("First Name: "),
                                                     input("Last Name: "),
                                                     input("Passport Name: ")))
                controller.add_plane(name, airline, seats, destination, passengers_list)
                print(f"\nPlane added!\n")
            except (AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")
            except ValueError:
                print(f"\nYou must introduce a number!\n")

        elif command == "2.2":
            try:
                print(f"\nUpdate a plane in the airport by index.")
                index = int(input("\nPlane Index :  "))

                print(f"\nThe plane is:")
                print(controller.get_plane_at_index(index))

                name = input("New Plane Name :  ")
                airline = input("New Plane Airline : ")
                seats = int(input("New Seats : "))
                destination = input("New Destination : ")
                nr = int(input("New Number of passengers : "))
                passengers_list = []
                for index in range(nr):
                    passengers_list.append(
                        Passenger(input("First Name: "), input("Last Name: "), input("Passport Name: ")))

                controller.update_plane(index, name, airline, seats, destination, passengers_list)
                print(f"\nPlane updated:\n")
                print(controller.get_plane_at_index(index))

            except (AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")
            except ValueError:
                print(f"\nYou must introduce a number!\n")

        elif command == "2.3":
            try:
                print(f"\nDelete a plane from the airport by index.")
                index = int(input("\nPlane Index :  "))

                print(f"\nThe plane is:")
                print(controller.get_plane_at_index(index))

                controller.delete_plane(index)
                print(f"\nPlane deleted!\n")

            except (AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")
            except ValueError:
                print(f"\nThe index must be an integer!\n")

        elif command == "3":
            try:
                print(f"\nSort the passengers in a plane by last name.")
                name = input("\nPlane Name :  ")
                plane = controller.sort_passengers_by_last_name(name)
                print(f"\n{plane}\n")
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "4":
            try:
                print(f"\nSort planes according to the number of passengers.")
                controller.sort_planes_by_number_of_passengers()
                print(f"\n{controller}\n")
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "5":
            try:
                print(f"\nSort planes according to the number of passengers "
                      f"with the first name starting with a given substring.")
                substring = input("\nSubstring starting first name : ")
                controller.sort_planes_by_passengers_with_name(substring)
                print(f"\n{controller}\n")
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "6":
            try:
                print(f"\nSort planes according to the string obtained by concatenation of "
                      f"the number of passengers in the plane and the destination.\n")
                controller.sort_planes_by_passengers_and_destination()
                print(f"\n{controller}\n")
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "7":
            try:
                print(f"\nIdentify planes that have passengers with "
                      f"passport numbers starting with the same 3 letters.\n")
                letter1 = input("Letter 1 : ")
                letter2 = input("Letter 2 : ")
                letter3 = input("Letter 3 : ")
                planes = controller.get_planes_with_passengers_with_passport(letter1, letter2, letter3)
                print("\nPlanes:")
                for plane in planes:
                    string = f"Plane: {plane.get_name()} \n"
                    string += f"Airline: {plane.get_airline()} \n"
                    string += f"Seats: {plane.get_seats()} \n"
                    string += f"Destination: {plane.get_destination()} \n"
                    print(string)
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "8":
            try:
                print(f"\nIdentify passengers from a given plane for which the first name "
                      f"or last name contains a string given as parameter.\n")
                name = input("Plane Name : ")
                string = input("Substring : ")
                passengers_list = controller.get_plane_passengers_with_string_in_name(name, string)
                for passenger in passengers_list:
                    string = f"First Name: {passenger.get_first_name()} || "
                    string += f"Last Name: {passenger.get_last_name()} || "
                    string += f"Passport number: {passenger.get_passport_num()}"
                    print(string)
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "9":
            # Identify plane/planes where there is a passenger with given name
            try:
                print(f"\nIdentify plane/planes where there is a passenger with given name.\n")
                name = input("Passenger Name : ")
                planes = controller.get_planes_with_passenger(name)
                print("\nPlanes:")
                for plane in planes:
                    string = f"Plane: {plane.get_name()} \n"
                    string += f"Airline: {plane.get_airline()} \n"
                    string += f"Seats: {plane.get_seats()} \n"
                    string += f"Destination: {plane.get_destination()} \n"
                    print(string)
            except (ValueError, AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "10":
            try:
                print("\nForm groups of k passengers from the same plane but with different last names.\n")
                name = input("Plane Name : ")
                k = int(input("K : "))
                group_list = controller.groups_of_passengers_in_plane_with_different_last_names(name, k)
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
            except (AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")
            except ValueError:
                print(f"\nYou must introduce a number!\n")

        elif command == "11":
            try:
                print("\nForm groups of k planes with the same destination "
                      "but belonging to different airline companies.\n")
                k = int(input("K : "))
                group_list = controller.groups_of_planes_with_same_destination_belonging_different_companies(k)
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
            except (AssertionError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")
            except ValueError:
                print(f"\nYou must introduce a number!\n")

        else:
            print("\nThis command doesn't exist!\n")

        command = input(">>> ")

    print("Bye bye!\n")
