def transform_to_set(l):
    """
    Tranform a given list into a set.
    :param l: list of integers
    :return: set version of the list
    """
    a = []
    for element in l:
        if element not in a:
            a.append(element)
    return a


def transform_to_set_2(l):
    """
    Tranform a given list into a set.
    :param l: list of integers
    :return: set version of the list
    """
    return list(set(l))


print(transform_to_set([1, 2, 3, 2, 1, 4]))
print(transform_to_set_2([1, 2, 3, 2, 1, 4]))

