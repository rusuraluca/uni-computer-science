% Binomial Distribution Bino(p)

clear all;
clc;

% simulate Bino(n,p) random var
n = input('Number of trials = ');
p = input('Probability of success in (0,1) = ');

% generate 1 variable
U = rand(n, 1);
X = sum(U < p);


% generate a sample of vars
N = input('Number of simulation = ');
for i = 1:N
    U = rand(n, 1);
    X(i) = sum(U < p);
end


% compare it to the Binomial(n,p) distribution graphically
% distinct values
UX = unique(X);

% nr of each distinct value occurence = the frequence
nX = hist(X, length(UX));
relfr = nX / N;

% graph
k = 0:n;
pk = binopdf(k, n, p);

plot(k, pk, '*',UX, relfr, 'ro')
legend('Bino distribution','Simulation')
