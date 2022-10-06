"""
Return the number of even integers in a list.
"""


def function(arr):
    cont = 0
    for i in range(len(arr)):
        if arr[i] % 2 == 0:
            cont = cont+1
    return cont


print(function([2, 3, 4, 5, 6, 7]))
