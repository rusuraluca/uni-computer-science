% Bernoulli Distribution Bern(p)


clear all;
clc;

% simulate Bern(p) random var
p = input('Probability of success in (0,1) = ');

% generate 1 variable
U = rand;
X = (U<p);

% generate a sample of vars

N = input('Number of simulation = '); %10,1e2,1e3,1e4
for i=1:N
    % the ith simulation
    U = rand;
    X(i) = U < p;
end

% compare it to the Bern(p) distribution
% distinct values
UX = unique(X)

% nr of each distinct value occurence = the frequence
nX = hist(X, length(UX));
relfr = nX / N
