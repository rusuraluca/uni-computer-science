def sum_of_divisor(x):
    """
    Calculate the sum of divisors of a given number
    :param x: integer
    :return: sum of x's divisors
    """
    s = 0
    for i in range(1, int(x / 2) + 1):
        if x % i == 0:
            s += i
    return s


def friends(x, y):
    """
    Define if two given numbers are "friends".
    :param x: integer
    :param y: integer
    :return:
    """
    return sum_of_divisor(x) == y and sum_of_divisor(y) == x


print(friends(220, 284))
