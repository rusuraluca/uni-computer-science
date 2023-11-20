"""
Pollard's p method
x0=2
and f(x)=x^2+1
"""

print("Pollard's p method")

n = 9089

def gcd(x, y):
    while(y):
       x, y = y, x % y
    return abs(x)

def f(x):
    return (x**2+1) % n
 
l = []
l.append(2)
for i in range(1, 21): 
    l.append(f(l[i-1]))
    print(f'{i} - {l[i]}')

print('-----------')

for i in range(1, 11): 
    c = l[i]
    d = l[i*2]
    a = (d-c) % n
    print(f'{i} - {c}')
    print(f'{i*2} - {d}')
    print (f'ANS = {gcd(a, n)}')
    print('-----------')
 
print('\n\n\n')  

"""
Fermat's method
"""
from math import *

print("Fermat's p method")

n = 6123

l = []
t0 = int(sqrt(n))
for i in range(1, 21): 
    t = t0 + i
    no = t**2 - n
    print(f'{i} - t = {t} - {no}')
    ans = 'no'
    if sqrt(no) == int(sqrt(no)): 
        ans = 'yes'
    print(sqrt(no))
    print (f'ANS = {ans}')
    print('-----------')
    
    
    
    
    
    
    
    
    
    
    
    