x = [7 7 4 5 9 9 4 12 8 1 8 7 3 13 2 1 17 7 12 5 6 2 1 13 14 10 2 4 9 11 3 5 12 6 10 7];
n = length(x);

conf_level = input('C:');
alpha = 1 - conf_level;
sigma = 5;
xbar = mean(x);

u1 = xbar - sigma / sqrt(n) * norminv(1 - alpha / 2);
u2 = xbar - sigma / sqrt(n) * norminv(alpha / 2);
fprintf("CI (sigma known): (%.3f, %.3f)\n", u1, u2);

sigma2 = std(x);
u1 = xbar - sigma2/sqrt(n) * tinv(1-alpha/2, n-1);
u2 = xbar - sigma2/sqrt(n) * tinv(alpha/2, n-1);
fprintf("CI (sigma unknown): (%.3f, %.3f)\n", u1, u2);

s2 = var(x);
ci1 = (n-1) * s2 / chi2inv(1 - alpha / 2, n-1);
ci2 = (n-1) * s2 / chi2inv(alpha/2, n-1);
fprintf("CI for the variance: (%.3f, %.3f)\n", ci1, ci2);
fprintf("CI for the std: (%.3f, %.3f)\n", sqrt(ci1), sqrt(ci2));