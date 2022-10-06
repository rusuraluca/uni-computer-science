'''
Given 2 integers, return True if one of them is 10 or if their sum is 10.
'''

a = int(input('a='))
b = int(input('b='))

if a == 10 or b == 10:
    print('a or b is 10')
elif a+b == 10:
    print('a+b is 10')
else:
    print('false')
