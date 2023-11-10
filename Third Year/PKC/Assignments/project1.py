import time


def gcd_euclid_recursive(a, b):
    """ Compute the GCD of two natural numbers recursively using the Euclidean Algorithm.
        Instead of subtraction, if we divide the smaller number, the algorithm stops when we find the remainder 0.

    Params:
    a : int 
        The first natural number
    b : int
        The second natural number

    Returns:
    int
        The GCD of a and b
    """
    if not b:
        return a
    
    return gcd_euclid_recursive(b, a % b)


def gcd_euclid_iterative(a, b):
    """ Compute the GCD of two natural numbers iteratively using the Euclidean Algorithm.

    Params:
    a : int 
        The first natural number
    b : int
        The second natural number

    Returns:
    int
        The GCD of a and b
    """
    while b:
        a, b = b, a % b
        
    return a


def gcd(a, b):
    """ Compute the GCD of two natural numbers by finding their common divisor starting from the minimum of the two numbers.

    Params:
    a : int 
        The first natural number
    b : int
        The second natural number

    Returns:
    int
        The GCD of a and b
    """
    divisor = min(a, b)
    while divisor > 0:
        if a % divisor == 0 and b % divisor == 0:
            return divisor
        divisor -= 1
        
        
def repeated_subtractions(a, b): 
    """ Compute the GCD of two natural numbers by repeated subtractions.
        If we subtract a smaller number from a larger one (we reduce a larger number), GCD doesn't change, 
        so if we keep subtracting repeatedly the larger of two, we end up with GCD.


    Params:
    a : int 
        The first natural number
    b : int
        The second natural number

    Returns:
    int
        The GCD of a and b
    """
    if a == 0:
        return b
    
    if b == 0:
        return a
    
    while a != b:
        if a > b:
            a -= b
        else:
            b -= a
    return a


inputs = [
    (0,0),
    (105, 0), 
    (48, 18),
    (100, 200), 
    (27, 81), 
    (123456789, 987654321), 
    (999999999, 111111111), 
    (123456789, 987654322), 
    (1234567890, 9876543210), 
    (9876543210987654321, 1234567890123456789), 
    (1234567890123456789, 9876543210987654321)
    ]

for a, b in inputs:
    start_time = time.time()
    gcd = gcd_euclid_recursive(a, b)
    end_time = time.time()
    print(f"1 for ({a}, {b}) = {gcd} in {end_time - start_time:.30f} seconds")

    start_time = time.time()
    gcd = gcd_euclid_iterative(a, b)
    end_time = time.time()
    print(f"2 for ({a}, {b}) = {gcd} in {end_time - start_time:.30f} seconds")

    start_time = time.time()
    gcd = repeated_subtractions(a, b)
    end_time = time.time()
    print(f"3 for ({a}, {b}) = {gcd} in {end_time - start_time:.30f} seconds")
    
    print("\n")
    