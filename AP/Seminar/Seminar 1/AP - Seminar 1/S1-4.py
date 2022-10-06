#4)Verify if a given number is perfect square.

n = int(input("n = "))

i = 1
#n = i * i ??

square = i * i
while square < n:
    i = i + 1
    square = i * i

if square == n:
    print(n, " is perfect square")
else:
    print(n, " is NOT a perfect square")

    
