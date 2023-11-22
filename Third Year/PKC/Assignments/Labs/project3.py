"""
2. Pollard's p algorithm. The implicit function will be f(x) = x^2 + 1, but it will also allow the use
of a function f given by the user.
"""


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


def pollards_p(n, func='x**2+1'):
    """ Pollard's p algorithm for factorization of a natural number.

    Params:
    n : int
        The natural number to be factorized
    f : str
        The implicit function, default is x^2+1

    Returns:
    tuple
        The factors of n
    """
    func = func.replace('^', '**')

    if func == 'x**2+1':
        f = lambda x: x**2 + 1
    else:
        f = lambda x: eval(func.replace('x', str(x)))

    l = []
    x0 = 2
    l.append(x0)
    j = 1
    for i in range(1, 21, 2):
        xi = f(l[i-1]) % n
        l.append(xi)

        xii = f(l[i]) % n
        l.append(xii)

        print(f'x{i} = {l[i]}')
        print(f'x{i+1} = {l[i+1]}')

        d = gcd(abs(l[2*j] - l[j]), n)
        print(f'(|x{2*j} - x{j}|, n) = (|{l[2*j]} - {l[j]}|, {n}) = {d}')

        if(1 < d < n):
            print(f'The obtained two factors of {n} are {d} and {n//d}')
            return (d, n//d)

        j += 1

    return None


# Tests
print('-------------------------------------')
print('T1:')
print('-------------------------------------')
assert pollards_p(4087, 'x^2+x+1') == (61, 67)
print('\n-------------------------------------')
print('T2:')
print('-------------------------------------')
assert pollards_p(9089, 'x**2+1') == (61, 149)
print('\n-------------------------------------')
print('TESTS PASSED!!!')
print('-------------------------------------\n\n')


# Menu
option = -1;
while option != '0':
    print('-------------------------------------')
    print('MENU:')
    print('0. Exit')
    print('1. Pollard\'s p algorithm with f^2+1')
    print('2. Pollard\'s p algorithm with a user-defined function')

    option = input('Option: ')

    if option == '0':
        break
    else:
        n = int(input('Give a natural number: '))
        if option == '1':
            pollards_p(n)
        elif option == '2':
            func = input('Give a function: ')
            pollards_p(n, func)
        else:
            print('Invalid option')
