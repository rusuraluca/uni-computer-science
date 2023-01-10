% Geometric Distribution Geo(p)

clear all;
clc;

% simulate Geo(p) random var
p = input('Probability of success in (0,1) = ');

X = 0;
while rand >= p
    X = X + 1;
end


N = input('Number of simulation = ');
for i=1:N
    X(i) = 0;
    while rand >= p
        X(i) = X(i) + 1;
    end
end

% compare to the Geo(p) distribution graphically
UX = unique(X);

% nr of each distinct value occurence = the frequence
nX = hist(X, length(UX));

relfreq = nX / N;

% graph
k = 0:20;
pk = geopdf(k, p);

plot(k, pk, '*', UX, relfreq, 'ro')
legend('Geo Distribution', 'Simulation')
