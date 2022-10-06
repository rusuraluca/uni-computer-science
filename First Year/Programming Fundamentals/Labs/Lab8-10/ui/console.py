from domain.vector_model import MyVector
from application.vector_controller import VectorController


def print_menu():
    """
    Print the menu options available in the interface.
    :return:
    """
    print("Application Commands:")
    print("EXIT = Exit program.")
    print("MENU = Show menu.")
    print("1 = Add a vector to the repository")
    print("2 = Get all vectors in the repository")
    print("3 = Get a vector at a given index in the repository")
    print("4 = Update a vector at a given index in the repository")
    print("5 = Update a vector identified by a given name_id in the repository")
    print("6 = Delete a vector by index in the repository")
    print("7 = Delete a vector identified by a given name_id in the repository")
    print("8 = Plot all vectors in a chart")
    print("11 = Get the list of vectors having a given sum of elements")
    print("19 = Delete all vectors that are between two given indexes")
    print("22 = Update the color of a vector identified by a given name_id")


def start(controller: VectorController):
    """
    Start the menu type console.
    :return:
    """
    print_menu()
    command = input(">>> ")

    while command != "EXIT":
        if command == "MENU":
            print_menu()
        elif command == "1":
            print("\nLet's add a new vector to the repository!")
            try:
                name_id = input("Unique Name ID :  ")
                color = input("Color : ")
                color = color.lower()
                type = int(input("Type : "))
                values = list(map((float or int), input("Values separated by space: ").strip().split()))
                controller.add_vector(name_id, color, type, values)
                print(f"Added {MyVector(name_id, color, type, values)}\n")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"{er}!\n")

        elif command == "2":
            try:
                print(f"\n{controller}\n")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "3":
            try:
                print("\nLet's get a vector at a given index in the repository!")
                index = int(input("Index :  "))
                print(f"\n{controller.get_vector_at_index(index)}\n")
            except ValueError:
                print("\nThe index must be an integer!\n")
            except (IndexError, AttributeError) as er:
                print(f"\n{er}!\n")

        elif command == "4":
            try:
                print("\nLet's update a vector at a given index in the repository!")
                index = int(input("Index :  "))
                print(f"The vector is {controller.get_vector_at_index(index)}.")
                print("\nUpdate the vector data:")
                name_id = input("New Unique Name ID :  ")
                color = input("New Color : ")
                color = color.lower()
                type = int(input("New Type : "))
                values = list(map(float, input("New Values : ").strip().split()))
                controller.update_vector_at_index(index, name_id, color, type, values)
                print(f"\nUpdated {controller.get_vector_at_index(index)}.\n")
            except ValueError:
                print("\nThe index must be an integer!\n")
            except (AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "5":
            try:
                print("\nLet's update a vector identified by a given name_id in the repository!")
                name_id = input("Unique Name ID :  ")
                print(f"The vector is {controller.get_vector_of_name_id(name_id)}.")
                print("\nUpdate the vector data:")
                color = input("New Color : ")
                color = color.lower()
                type = int(input("New Type : "))
                values = list(map(float, input("New Values : ").strip().split()))
                controller.update_vector_by_name_id(name_id, color, type, values)
                print(f"\nUpdated {controller.get_vector_of_name_id(name_id)}.\n")
            except (ValueError, IndexError, AttributeError) as er:
                print(f"\n{er}!\n")

        elif command == "6":
            try:
                print("\nLet's delete a vector by its index in the repository!")
                index = int(input("Index :  "))
                controller.delete_vector_at_index(index)
                print("\nVector deleted!\n")
                print(controller)
            except ValueError:
                print("\nThe index must be an integer!\n")
            except (AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "7":
            try:
                print("\nLet's delete the vectors identified by a given name_id in the repository!")
                name_id = input("Unique Name ID :  ")
                controller.delete_vector_by_name_id(name_id)
                print("\nVector deleted!\n")
                print(controller)
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "8":
            try:
                controller.plot_vectors_in_chart()
                print("\nVectors plotted in the chart above!\n")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "11":
            try:
                print("\nLet's get the vectors having a certain sum of elements!")
                summ = float(input("Sum :  "))
                print(f"\n{controller.get_vectors_of_given_sum(summ)}\n")
            except ValueError:
                print("\nThe sum must be a number!\n")
            except (AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "19":
            try:
                print("\nLet's delete all vectors between two given indexes!")
                index1 = int(input("Index 1 :  "))
                index2 = int(input("Index 2 :  "))
                controller.delete_vectors_between_indexes(index1, index2)
                print("\nPoints deleted!")
                print(f"\n{controller}")
            except ValueError:
                print("\nBoth indexes must be integers!\n")
            except (AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        elif command == "22":
            try:
                print("\nLet's update the color of a vector!")
                name_id = input("Unique Name ID :  ")
                vector = controller.get_vector_of_name_id(name_id)
                print(f"{vector}\n")
                color = input("New Color : ")
                color = color.lower()
                vector = controller.update_vector_color_by_name_id(name_id, color)
                print(f"Updated {vector}\n")
            except (ValueError, AttributeError, IndexError) as er:
                print(f"\n{er}!\n")

        else:
            print("\nThis command doesn't exist!\n")

        command = input(">>> ")

    print("Bye bye!\n")
