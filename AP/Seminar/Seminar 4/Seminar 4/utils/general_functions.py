def get_maximum_grade(students):
    """
    Find the maximum grade of all student
    :param students: list of students
    :return:
    """
    if len(students) == 0:
        return None
    else:
        max_grade = students[0][1]
        # students[start:end] = students[start], students[start + 1], ..., students[end - 1]
        for student in students[1:]:
            if student[1] > max_grade:
                max_grade = student[1]
        return max_grade



def student_name(students, value):
    """
    Find all students with the name starting with a given letter or substring.
    :param students: list of students
    :return:
    """
    name_list = []
    for student in students:
        if student[0].startwith(value):
            name_list.append(student)


def remove(students):
    # Remove all students with the grade smaller than 5
    for student in students[::-1]:
        if student[1] < 5:
            del student


def is_palindorm(name):
    if len(name) == len(::name)



