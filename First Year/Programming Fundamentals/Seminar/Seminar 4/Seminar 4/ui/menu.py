import domain.student_list as stud_list


def print_menu():
    """
    Print the menu options available in the interface.
    :return:
    """
    print("0 - exit program")
    print("1 - print menu")
    print("2 - print students")
    print("3 - add new student")
    print("4 - find student by name")
    print("5 - delete student by name")
    print("6 - find the students with higher grades than the given value")
    print("7 - find students with maximum grade")


def start():
    """
    Start the menu type console.
    :return:
    """
    print_menu()
    command = input(">>> ")
    # [['name1', grade1], ['name2', grade2], ...]
    student_list = [['a', 8], ['b', 10], ['c', 4]]
    while command != "0":
        if command == "1":
            print_menu()
        elif command == "2":
            stud_list.print_all_students(student_list)
        elif command == "3":
            new_entry = []
            new_entry.append(input("New name: "))
            new_entry.append(int(input("New grade: ")))
            stud_list.read_new_student(student_list, new_entry)
            stud_list.print_all_students(student_list)
        elif command == "4":
            read_name = input("Student name: ")
            found_list = stud_list.find_student_by_name(student_list, read_name)
            if found_list is None:
                print("Student not found")
            else:
                stud_list.print_all_students([found_list])  # [[found_name, found_grade]]
        elif command == "5":
            read_name = input("Student name: ")
            deleted_student = stud_list.delete_student_by_name(student_list, read_name)
            if deleted_student is None:
                print("Student not found")
            else:
                print(f"{deleted_student} was deleted")
                print("Current content of the list:")
                stud_list.print_all_students(student_list)
        elif command == "6":
            read_value = int(input("Give me a value: "))
            new_array = stud_list.higher_grades(student_list, read_value)
            if len(new_array) == 0:
                print("There are no students with higher grades")
            else:
                stud_list.print_all_students(new_array)
        elif command == "7":
            stud_max_grade = stud_list.find_student_with_max_grade(student_list)
            if len(stud_max_grade) == 0:
                print("There is no student in the list")
            else:
                print("Student with maximum grade:")
                stud_list.print_all_students(stud_max_grade)
        else:
            print("Invalid command")
        command = input(">>> ")
