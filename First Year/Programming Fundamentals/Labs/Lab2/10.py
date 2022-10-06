def read_consecutively():
    """
        Prints the number of pairs n1 and n2 of numbers read consecutively
        with the property that the number of digits 5 from n1 is strictly higher
        than the number of digits 5 from n2.
        e.g.
        If the numbers read are 182, 457, 341, 497, 5597, 1335, 15, 38, 5, 0
        than the result is 3 (as the pairs 457-341, 5597-1335, 15-38 satisfy the required property).

        Input
            Integers numbers, until number 0 is read.

        Output
            Integer representing the number of pairs of numbers read consecutively
            with the required property.
    """

    pairs = 0

    n1 = int(input("n="))
    digit1_5 = 0
    while n1:
        if n1 % 10 == 5:
            digit1_5 = digit1_5 + 1
        n1 = n1/10

    n2 = int(input("n="))
    while n2 != 0:
        digit2_5 = 0
        cpyn2 = n2
        while cpyn2:
            if cpyn2 % 10 == 5:
                digit2_5 = digit2_5 + 1
            cpyn2 = cpyn2 / 10

        if digit1_5 > digit2_5:
            pairs = pairs + 1

        digit1_5 = digit2_5
        n2 = int(input("n="))

    print(pairs)


read_consecutively()
