# version 1
# from utils.general_functions import get_maximum_grade
# get_maximum_grade(students)

# version 2
# import utils.general_functions as gf
# gf.get_maximum_grade(students)

# version 3
# import utils.general_functions
# utils.general_functions.get_maximum_grade(students)

# version 4
# do not use it unless you write tests!!!
# from utils.general_functions import *


def print_all_students(students):
    """
    ex. 1
    Print all student from the list
    :param students: list of students
    :return:
    """
    for student in students:
        print("Name:", student[0], "Grade:", student[1])


def read_new_student(students: list, new_entry: list):
    """
    ex. 2
    Add a new student to the list
    :param students: list of students
    :param new_entry: new student
    :return:
    """
    # if 0 < new_entry[1] <= 10:
    if new_entry[1] > 0 and new_entry[1] <= 10:
        students.append(new_entry)
    else:
        print("Invalid input")


def find_student_by_name(students, input_name):
    """
    ex. 3
    :param students: a list of students
    :param input_name: the searched name
    Finds the student by the name
    """
    for student in students:
        if student[0] == input_name:
            return student


def delete_student_by_name(students, input_name):
    """
    ex. 4
    Delete first student with specific name.
    :param students: list of students
    :param input_name:
    :return:
    """
    found_student = find_student_by_name(students, input_name)
    if found_student is not None:
        students.remove(found_student)
    return found_student


def higher_grades(students, value):
    """
    ex. 5
    Find students with grade higher that a given value
    :param students:
    :param value:
    :return:
    """
    new_list = []
    for student in students:
        if student[1] > value:
            new_list.append(student)
    return new_list


def find_student_with_max_grade(students):
    """
    ex. 6
    Find all students who have the maximum grade
    :param students: list of students
    :return: a new list with students with the maximum grade
    """
    stud_max_grade = []
    max_grade = utils.general_functions.get_maximum_grade(students)
    for student in students:
        if student[1] == max_grade:
            stud_max_grade.append(student)
    return stud_max_grade
