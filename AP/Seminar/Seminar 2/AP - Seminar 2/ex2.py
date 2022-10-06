def reading():
    '''This function reads the first n numbers given by the user and puts them into an array'''
    n=int(input("n="))
    a = []
    for i in range(0,n):
        a.append(int(input()))
    return a


def read_till_empty_line():
    """
    Read number from the user till an empty line is read.
    :return: the numbers introduced by the user
    """
    a = []
    n = input('n = ')
    while n != "":
        a.append(int(n))
        n = input('n = ')
    return a


print(reading())
print(read_till_empty_line())
