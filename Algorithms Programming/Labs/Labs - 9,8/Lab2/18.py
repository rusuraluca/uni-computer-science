"""
    Prints the number of common digits of two numbers,
    as well as the digits.
    e.g.
        first number: 21348
        second number: 14513
        3
        1, 3, 4
    Input
        Two integers
    Output
        The integers required
"""


def number_of_common_digits(a, b):
    return len(set(str(a)).intersection(str(b)))


def common_digits(a, b):
    fr_a = [0] * 10
    fr_b = [0] * 10
    while a:
        fr_a[a % 10] = 1
        a = a // 10

    while b:
        fr_b[b % 10] = 1
        b = b // 10

    for i in range(10):
        if fr_a[i] > 0 and fr_b[i] > 0:
            print(i),


a = int(input("first number="))
b = int(input("second number="))
print(number_of_common_digits(a, b))
common_digits(a, b)
