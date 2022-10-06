# ex. a
def readlist():
    """
    Read a list of integer numbers.
    :return: list introduces by the user
    """
    n = int(input('n='))
    l = []
    for i in range(n):
        l.append(int(input('l[' + str(i) + ']=')))
    return l


# ex. b
def turn_to_string(l):
    """
    Turns a given list into a string
    :param l: integer list
    :return: string
    """
    string_rep = ""
    for num in range(len(l)):
        string_rep += str(l[num]) + " "
    return string_rep


# ex.c
def power_of_2(a):
    """
    Check if a number if the power of 2 by multiple divisions.
    :param a:
    :return: True if a is the power of 2, False otherwise
    """
    if a == 1:
        return True
    if a % 2 != 0:
        return False
    # if a % 2 == 1:
    #     return a == 1
    while a % 2 == 0:
        a = a / 2
    if a == 1:
        return True
    else:
        return False
    # return a == 1


def sum_of_nr(l):
    '''Computes the sum of specific numbers'''
    sum = 0
    for i in l:
        if power_of_2(i):
            sum += i
    return sum


# ex. d
def filter_elem(l):
    """
    We filter the elements from the list which are not powers of 2
    :param l: The list
    :return: List with the filtered elements
    """
    result_list = []
    for i in l:
        if not power_of_2(i):
            result_list.append(i)

    return result_list


# ex. e
def delete_sequence(my_list):
    """
    Delete the sequence between the first and last even number in the list.
    :param my_list: list of integers
    :return: new list
    """
    first_even, last_even = -1, -1
    for i in range(0, len(my_list)):
        if my_list[i] % 2 == 0 and first_even == -1:
            first_even = i
        elif my_list[i] % 2 == 0:
            last_even = i

    if first_even != -1:
        if last_even == -1:
            del my_list[first_even]
        else:
            del my_list[first_even:last_even + 1]
    return my_list


# ex. f
def remove_even_elements(l):
    '''
    :param l: The function removes an element from the list if that element is an even number
    Input: a list of integers
    :return: a list of odd integers
    '''
    for i in range(len(l) - 1, -1, -1):
        if l[i] % 2 == 0:
            del l[i]
    return l


# ex. g
def longest_sequence(l):
    """
    Define the position and length of the longest sequence with a given property
    :param l: list of integers
    :return: start index of the sequence and its length
    """
    max_i = -1 # this is the index where the longest sequence starts
    max_lenght = -1 # this is the lenght of the longest sequence
    j=-1 # the lenghts of the curent sequence
    i=0
    while i<len(l):
        if l[i]%2==0:
            j=0
            while l[i]%2==0: # [1,2,4,5, 2]
                j+=1
                i+=1
        if j>max_lenght:
            max_lenght=j
            max_i=i-j
        else:
            i+=1
    return max_i, max_lenght


def shift(l):
    """ Shifts the longest sequence of even numbers to the begining"""
    i, j = longest_sequence(l)
    print(i, j)
    l1 = l[i:i+j]
    l = l1 + l[:i] + l[i+j:]
    return l


def print_menu():
    print("0 - exit program")
    print("1 - read a list")
    print("2 - print list")


def start():
    a = []
    print_menu()
    command = input(">>> ")
    while command != '0':
        if command == '1':
            a = readlist()
        elif command == '2':
            print(turn_to_string(a))
        else:
            print('Command not found!')
        command = input(">>> ")



# my_list = readlist()  # 5, 8, 4, 7
# print(turn_to_string(my_list))  # 5 8 4 7
# print(sum_of_nr(my_list))  # 12
# print(filter_elem(my_list))  # [5, 7]

# print(delete_sequence([5, 8, 4, 7, 2, 3]))  # [5, 3]
# print(delete_sequence([5, 8, 9, 1, 3]))  # [5, 9, 1, 3]
# print(remove_even_elements([1, 2, 4, 5, 8]))
# print(shift([5,2,4,7,6,8,4,3]))
start()