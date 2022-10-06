def function(l):
    """
    Calculating the number of even numbers in a given list.
    l - list of integers
    :returns number of even numbers in the list
    """
    cont = 0
    for i in range(len(l)):
        if l[i] % 2 == 0:
            cont = cont + 1
    return cont


print('Number of even numbers: ', function([1, 3, 6, 2, 7]))
print('Number of even numbers: ', function([]))
