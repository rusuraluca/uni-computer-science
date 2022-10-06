def my_sum(l, exclude = 12):
    """
    Calculate the sum of elements except a specific one.
    :param exclude:
    :param l: list of integers
    :return: sum of elements except 12
    """
    # s = 0
    # for i in range(len(l)):
    #     if l[i] != 12:
    #         s += l[i]
    # return s
    s = 0
    for element in l:
        if element != exclude:
            s += element
    return s


print(my_sum([1, 2, 12], 12)) # 3
print(my_sum([1, 2, 12], 2)) # 13
print(my_sum([1, 2, 12])) # 3

