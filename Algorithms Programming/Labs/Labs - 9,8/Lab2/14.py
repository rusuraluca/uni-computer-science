def num_of_1_binary(n):
    """
        Prints the number of 1s from the binary representation of n.
        e.g.
        547 has 4 digits equal to 1 in its binary representation.

        Input
            Integer
        Output
            Integer
    """
    num = 0
    while n:
        if n % 2 == 1:
            num = num + 1
        n = n/2

    return num


n = int(input("n="))
print(num_of_1_binary(n))
