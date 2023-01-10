x1 = [3.1 2.9 3.8 3.3 2.7 3.0 2.8 2.5 2.6 2.0 3.2 2.4 2.3 3.1 2.1 3.4];
x2 = [6.9 6.4 4.7 4.3 5.1 6.3 5.9 5.4 5.3 5.2 5.1 5.9 5.8 4.9];

alpha = 0.05;

n1 = length(x1); 
n2 = length(x2);
m1 = mean(x1); 
m2 = mean(x2);
v1 = var(x1); 
v2 = var(x2);

% part a. 
% The null hypothesis H0: sigma1^2 = sigma2^2
% The alt. hypothesis H1: sigma1^2 != sigma2^2
% two-tailed for comparing the variances

f1 = finv(alpha/2, n1 - 1, n2 - 1);
f2 = finv(1 - alpha/2, n1 - 1, n2 - 1); % quantiles for two-tailed test (for rejection region)

[H, P, ci, stats] = vartest2(x1, x2, "alpha", alpha);

fprintf('\n part a. Comparing variances\n')
fprintf('Two-tailed test for comparing variances\n')
if H == 0
    fprintf('H is %d\n', H)
    fprintf('So the null hypothesis is not rejected,\n')
    fprintf('i.e. the variances seem to be equal\n')
    fprintf('the rejection region for F is (%6.4f, %6.4f) U (%6.4f, %6.4f)\n', -inf, f1, f2, inf)
    fprintf('the value of the test statistic F is %6.4f\n', stats.fstat)
    fprintf('the P-value for the variances test is %6.4f\n', P)
else
    fprintf('H is %d\n', H)
    fprintf('So the null hypothesis is rejected,\n')
    fprintf('i.e. the variances seem to be different\n')
    fprintf('the rejection region for F is (%6.4f,%6.4f)U(%6.4f,%6.4f)\n', -inf, f1, f2, inf)
    fprintf('the value of the test statistic F is %6.4f\n', stats.fstat)
    fprintf('the P-value for the variances test is %6.4f\n', P)
end