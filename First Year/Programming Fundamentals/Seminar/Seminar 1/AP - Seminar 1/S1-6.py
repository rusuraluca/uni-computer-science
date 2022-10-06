#Reverse a given number and return true if it is the same as the original number.

#121 = 121
#123 <> 321

n = int(input("n = "))

original_n = n
reversed_n = 0
while original_n > 0:
    digit = original_n % 10
    reversed_n = (reversed_n * 10) + digit
    original_n = original_n // 10

if n == reversed_n:
    print(n, " = with reversed n", reversed_n)
else:
    print(n, " and ", reversed_n, " are not the same")
    
    
