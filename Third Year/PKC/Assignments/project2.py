"""
5. Algorithm for computing the value of Euler's function for natural numbers. 
For a given value v and a given bound b, 
list all natural numbers less than b which have v as the value of Euler's function.
"""

def solve(v, b):
    """ Compute the value of Euler's function for natural numbers.

    Params:
    v : int 
        The value of Euler's function
    b : int
        The bound

    Returns:
    list
        A list of natural numbers less than b which have v as the value of Euler's function
    """
    result = []
    for n in range(1, b):
        if euler_function(n) == v:
            result.append(n)
    return result


def euler_function(n):
    """ Compute the value of Euler's function for a natural number.
        Euler's function (also called the Phi function) counts the number of positive integers less than n that are co-prime to n (=only one common factor with n).
    
    Params:
    n : int
        The natural number

    Returns:
    int
        The value of Euler's function for n
    """
    count = 0
    for i in range(1, n):
        if gcd(n, i) == 1:
            count += 1
    return count


def gcd(a, b):
    """ Compute the greatest common divisor of two natural numbers
    
    Params:
    a : int
        The first natural number
    b : int
        The second natural number
    
    Returns:
    int
        The greatest common divisor of a and b
    """
    while b:
        a, b = b, a % b
    return a


def euler_function2(n) :
    """ Compute the value of Euler's function for a natural number.
        Euler's function (also called the Phi function) counts the number of positive integers less than n that are co-prime to n (=only one common factor with n).
    
    Params:
    n : int
        The natural number

    Returns:
    int
        The value of Euler's function for n. 
    """
    result = n  
      
    # consider all prime factors of n and for every prime factor p, multiply result with (1 - 1 / p)
    p = 2
    while p * p <= n :
        # check if p is a prime factor
        if n % p == 0 :
            # if yes, update n and result
            while n % p == 0 :
                n = n // p
                
            result = result * (1.0 - (1.0 / float(p)))
        p = p + 1
         
    # if n has a prime factor greater than sqrt(n) (there can be at-most one such prime factor)
    if n > 1 :
        result -= result // n
        
    return int(result)




v = 42
b = 100
print(solve(v, b))

    