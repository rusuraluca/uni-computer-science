from domain.student_list import *
from utils.general_functions import *


def test_read_new_student():
    """
    Test function read_new_student
    :return:
    """
    students = []
    read_new_student(students, ['a', 8])
    assert len(students) == 1
    assert students == [['a', 8]]

    read_new_student(students, ['b', 0])
    assert len(students) == 1
    assert students == [['a', 8]]

    read_new_student(students, ['c', 100])
    assert len(students) == 1
    assert students == [['a', 8]]


def test_find_student_by_name():
    """
    Test function find_student_by_name
    :return:
    """
    students = [['a', 8], ['b', 10], ['c', 4]]
    assert find_student_by_name(students, "a") == ['a', 8]
    assert find_student_by_name(students, "c") == ['c', 4]
    assert find_student_by_name(students, "d") is None


def test_delete_student_by_name():
    """
    Test function delete_student_by_name
    :return:
    """
    students = [['a', 8], ['b', 10], ['c', 4]]
    assert delete_student_by_name(students, "a") == ['a', 8]
    assert len(students) == 2
    assert students == [['b', 10], ['c', 4]]

    assert delete_student_by_name(students, "c") == ['c', 4]
    assert len(students) == 1
    assert students == [['b', 10]]

    assert delete_student_by_name(students, "d") is None
    assert len(students) == 1
    assert students == [['b', 10]]


def test_higher_grades():
    """
    Test function higher_grades
    :return:
    """
    students = [['a', 8], ['b', 10], ['c', 4]]
    assert higher_grades(students, 9) == [['b', 10]]
    assert higher_grades(students, 10) == []
    assert higher_grades(students, 0) == [['a', 8], ['b', 10], ['c', 4]]


def test_get_maximum_grade():
    """
    Test function get_maximum_grade
    :return:
    """
    students = [['a', 8], ['b', 10], ['c', 4]]
    assert get_maximum_grade(students) == 10

    students = [['a', 8], ['c', 4]]
    assert get_maximum_grade(students) == 8

    students = []
    assert get_maximum_grade(students) is None


def test_find_student_with_max_grade():
    """
    Test function find_student_with_max_grade
    :return:
    """
    students = [['a', 8], ['b', 10], ['c', 4]]
    assert find_student_with_max_grade(students) == [['b', 10]]

    students = [['a', 8], ['b', 8], ['c', 4]]
    assert find_student_with_max_grade(students) == [['a', 8], ['b', 8]]

    students = []
    assert find_student_with_max_grade(students) == []


def all_tests():
    """
    Run all tests.
    :return:
    """
    test_read_new_student()
    test_find_student_by_name()
    test_delete_student_by_name()
    test_higher_grades()
    test_get_maximum_grade()
    test_find_student_with_max_grade()
