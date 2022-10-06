"""
Compute the sum of n numbers given as a list.
Modify the function to exclude number 12 from the sum.
"""


def function():
    n = int(input("n="))
    s = 0
    a = []

    for i in range(0, n):
        a.append(int(input()))

        if a[i] != 12:
            s = s + a[i]

    return s


print(function())
