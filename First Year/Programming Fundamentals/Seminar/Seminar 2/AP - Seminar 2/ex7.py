def construct_sequence(n):
    """
    Compute and return the sequence 1, 2, 2, 3, 3, 3, 4, 4, 4, 4,.... given its length
    :param n: length of the sequence
    :return: contructed sequence
    """
    array = []
    for i in range(1, n+1):
        for j in range(0, i):
            array.append(i)

    return array[:n]


def construct_sequence_2(n):
    """
    Compute and return the sequence 1, 2, 2, 3, 3, 3, 4, 4, 4, 4,.... given its length
    :param n: length of the sequence
    :return: contructed sequence
    """
    number = 1
    occurence = 1
    array = []
    while n > 0:
        array.append(number)
        occurence -= 1
        if occurence == 0:
            number += 1
            occurence = number
        n -= 1
    return array


print(construct_sequence(5)) # 1, 2, 2, 3, 3
print(construct_sequence_2(5)) # 1, 2, 2, 3, 3