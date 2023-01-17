%h0: sigma1 = sigma2
%h1: sigma1 != sigma 2 - two tailed test

X1 = [46, 37, 39, 48, 47, 44, 35, 31, 44, 37];
X2 = [35, 33, 31, 35, 34, 30, 27, 32, 31, 31];
n1 = length(X1);
n2 = length(X2);
v1 = var(X1);
v2 = var(X2);
m1 = mean(X1);
m2 = mean(X2);

significance_lvl = 0.05;

[h, p, ci, stats] = vartest2(X1, X2, significance_lvl, 0);

fprintf('POINT a.\n');

if h == 0
    fprintf('H0 is not rejected, sigmas are equal!\n');
else 
    fprintf('H0 is rejected, population variances differ \n');
end

q1 = finv(significance_lvl/2, stats.df1, stats.df2);
q2 = finv(significance_lvl/2, stats.df2, stats.df1);

fprintf("Observed value %f\n", stats.fstat);
fprintf('P-value is %f\n', p);
fprintf('Rejection region R is (-inf, %f) U (%f, inf)\n', q1, q2);

fprintf('POINT b.\n');

if h == 0
    n = n1 + n2 - 2;
    t = tinv(1 - significance_lvl/2, n);
    sp = sqrt(((n1 - 1) * v1 + (n2 - 1) * v2)/n);
    left = m1 - m2 - t * sp * sqrt(1/n1+1/n2);
    right = m1 - m2 + t * sp * sqrt(1/n1 + 1/n2);
else
    c = (v1/n1)/(v1/n1 + v2/n2);
    n = c ^ 2 / (n1-1) + (1-c) ^ 2/ (n2 - 1);
    n = 1/n;
    t = tinv(1-significance_lvl/2, n);
    left = m1 - m2 - t * sqrt(v1/n1 + v2/n2);
    right = m1 - m2 + t * sqrt(v1/n1 + v2/n2);
end

fprintf("\nb)\n");
fprintf("The 95 confidence interval is: (%f, %f)\n", left, right);
