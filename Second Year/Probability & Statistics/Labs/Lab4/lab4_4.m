% Pascal Distribution NB(n,p) 

clear all;
clc;

n = input('Number of trials = ');
p = input('Probability of success in (0,1) = ');

for j = 1:n
  X(j) = 0;
  while rand >= p
    X(j) = X(j) + 1;
  end
end

Y = sum(X);
clear X
clear Y

N = input('Number of simulation = ');
for i=1:N
    for j=1:n
        X(j) = 0;
        while rand >= p
            X(j) = X(j) + 1;
        end
    end
    Y(i) = sum(X);
end


UY = unique(Y);
nY = hist(Y, length(UY));
relfreq = nY / N;

% graph
k = 0:150;
pk = nbinpdf(k,n, p);

clf;

plot(k, pk, '*', UY, relfreq, 'ro')
legend('Pascal Distribution', 'Simulation')
