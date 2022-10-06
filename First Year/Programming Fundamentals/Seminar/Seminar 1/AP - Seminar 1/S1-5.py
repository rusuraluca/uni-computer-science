n = int(input("n= "))


d = 2
res = True
while (d < n) and (res == True):
    if n % d == 0:
        res = False
    else:
        d = d + 1

if res:
    print("Number is prime")
else:
    print("Number is not prime")

    
