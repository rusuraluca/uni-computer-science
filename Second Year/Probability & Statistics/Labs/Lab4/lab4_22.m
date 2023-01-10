pkg load statistics

# 2.
# a)
# p = 0.3 and n = 10
clear X
p = input("Bernoulli Distribution Bern: ");
n = input("Nr of simulation: ");

for i = 1:n
  r = rand;
  X(i) = r < p;
end

U_X = unique(X);
u_X = hist(X, length(U_X))
u_X/n

# b)
# p = 0.3 and N = 100000 and n = 10
clear X

p = input("Binomial Distribution Bern: "); # prob of a succeces
N = input("Nr of simulation: ");
n = input("Nr of trials:"); # nr of trials

r = rand(n, N);
X = sum(r < p);
U_X = unique(X);
u_X = hist(X, length(U_X))
k = 0:n; # number of succeces
p_k = binopdf(k,n,p)
clf
plot(k, p_k, 'o', U_X, u_X/N, '*')


# c)
# p = 0.3 and N = 100000
clear X

p = input("Geometric Distribution: ");
N = input("Nr of simulations: ")

for i = 1:N
  X(i) = 0;
  while rand >= p
    X(i) = X(i) + 1;
  endwhile
end

k = 0:20;
p_k = geopdf(k, p)
U_X = unique(X);
u_X = hist(X, length(U_X))
clf
plot(k, p_k, 'o', U_X, u_X/N, '*')

# d)
# p = 0.3 and N = 100000 and n = 10
clear X
clear Y

p = input("Pascal Distribution: ");
N = input("Nr of simulations: ");
n = input("Nr of succeces: ");

for i = 1:N
  for j = 1:n
    X(j) = 0;
    while rand >= p
      X(j) = X(j) + 1;
    endwhile
    Y(i) = sum(X);
  endfor
end

U_Y = unique(Y);
n_Y = hist(Y, length(U_Y));
k = 0:150;
p_k = nbinpdf(k, n, p);
plot(k, p_k, 'o', U_Y, n_Y/N, '*')

