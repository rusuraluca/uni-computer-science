"""
Write a function to read a list of integers from the user and return it.
"""


def read_list():
    n = int(input("n="))
    a = []

    for i in range(0, n):
        a.append(int(input()))
    return a


print(read_list())


def read_list_till_empty_line():
    a = []
    n = int(input("n="))

    while n != " ":
        a.append(n)
        n = input("n=")

    return a


print(read_list_till_empty_line())
