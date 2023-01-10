pkg load statistics

x = [7 7 4 5 9 9 4 12 8 1 8 7 3 13 2 1 17 7 12 5 6 2 1 13 14 10 2 4 9 11 3 5 12 6 10 7];

alpha = input ('alpha =');

sigma = 5;

xbar = mean(x);

n = length(x);

u1 = xbar - sigma/sqrt(n) * norminv(1-alpha/2)
u2 = xbar - sigma/sqrt(n) * norminv(alpha/2)

s = std(x);

u1 = xbar - s/sqrt(n) * tinv(1-alpha/2, n-1)
u2 = xbar - s/sqrt(n) * tinv(alpha/2, n-1)

o1 = (n-1)*s*s/chi2inv(1-alpha/2, n-1)
o2 = (n-1)*s*s/chi2inv(alpha/2, n-1)
