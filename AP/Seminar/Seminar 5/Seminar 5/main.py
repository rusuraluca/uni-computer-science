import point_list

def print_menu():
    print("0 - exit program")
    print("1 - print menu")


def start():
    print_menu()
    command = input(">>> ")

    while command != "0":
        if command == "1":
            print_menu()
            print("Invalid command")
        elif command == "2":


            point_list.distance
            print("Invalid command")
        command = input(">>> ")
