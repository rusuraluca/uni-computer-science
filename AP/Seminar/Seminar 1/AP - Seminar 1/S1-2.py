#2)Compute the sum of the first n natural numbers.

n = int(input("n = "))

if n < 0:
    print("Negative number not allowed!")
else:
    s = 0
    for i in range(n+1):
        s = s + i
    print("sum is", s)

i = 1
s = 0
while i <= n:
    s = s + i
    i = i + 1
print("sum using while is ", s)
