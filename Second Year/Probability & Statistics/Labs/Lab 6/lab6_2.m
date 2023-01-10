clear
X1 = [22.4 21.7 24.5 23.4 21.6 23.3 22.4 21.6 24.8 20.0];
X2 = [17.7 14.8 19.6 19.6 12.1 14.8 15.4 12.6 14.0 12.2];

n1 = length(X1);
n2 = length(X2);

alpha = input('significance level = ');
tail = 0;

[H, P, CI, STATS] = vartest2(X1, X2, alpha, tail);

f1 = finv(alpha/2, n1-1, n2-1);
f2 = finv(1-alpha/2, n1-1, n2-1);

if H == 1 
    fprintf('\nnull hypothesis is rejected\n') 
else
    fprintf('\nnull hypothesis is not rejected\n')
end

fprintf('rejection region is (%f, %6.4f) U (%6.4f, %f)\n', -inf, f1, f2, inf)
fprintf('value of the test statistic F is %6.4f\n', STATS.fstat)
fprintf('P for the variances test is %6.4f\n', P)
fprintf('rejection region is (%6.4f, %6.4f)\n', CI)