% data sample
x_steel = [4.6, 0.7, 4.2, 1.9 4.8 6.1 4.7 5.5 5.4]
x_glass = [2.5, 1.3, 2.0, 1.8, 2.7, 3.2, 3.0, 3.5, 3.4]

% size of data sample
n1 = length(x_steel)
n2 = length(x_glass)

% alpha = the significance level
alpha = 0.05;

%a
fprintf("a)");

% H0: sigma_glass^2 = sigma_steel^2  (the variances of the two populations are equal)
% H1: sigma_glass^2 != sigma_premium^2 (the variances of the two populations seem to differ)
% => we perform a two-tailed test

[H, P, CI, stats] = vartest2(x_steel, x_glass, "alpha", alpha);

% result of the test, h = 0, if H0 is NOT rejected,
% h = 1, if H0 IS rejected

fprintf('\n H is %d', H)
if H == 1
  fprintf('\n So the null hypothesis is rejected, \n')
  fprintf('i.e the variances of the two populations seem to differ.\n')
else
  fprintf('\nSo the null hypothesis is not rejected,\n')
  fprintf('i.e. the variances of the two populations are equal.\n')
end

% building the rejection region
% RR = (-inf, tt_{alpha/2}) U (tt_{1-alpha/2},inf) since it's a two-tailed test

tt_alpha1 = finv(alpha/2, n1-1, n2-1)
tt_alpha2 = finv(1-alpha/2, n1-1, n2-1)
RR1 = [-inf, tt_alpha1]
RR2 = [tt_alpha2, inf] % vector with 2 positions

% print ZVAL, P and RR on the screen
fprintf('\nThe rejection region is (%4.4f, %4.4f) U (%4.4f, %4.4f)\n', RR1, RR2);
fprintf('The value of the test statistic z is %4.4f\n', stats.fstat);
fprintf('The P-value of the test is %4.4f\n\n', P);





% data sample
x_standard = [46, 37, 39, 48, 47, 44, 35, 31, 44, 37]
x_new = [35, 33, 31, 35, 34, 30, 27, 32, 31, 31]

% data size
n1 = length(x_standard)
n2 = length(x_new)

% alpha = 0.05
alpha = 0.05

% For the difference of two population means
% We don't know sigma and we know they are not equal so it's the third case

% compute the sample variances
var1 = var(x_standard);
var2 = var(x_new);

% compute the means
xbar1 = mean(x_standard);
xbar2 = mean(x_new);

% compute c and n
c = (var1/n1)/(var1/n1+var2/n2);
n = 1/((c^2/(n1-1) + (1-c)^2/(n2-1)));

% and now the quantiles referring to the T(n) distribution
t1 = tinv(1-alpha/2, n);

% compute the limits of the confidence interval
limit1 = xbar1 - xbar2 - t1*sqrt((var1/n1)+(var2/n2));
limit2 = xbar1 - xbar2 + t1*sqrt((var1/n1)+(var2/n2));

fprintf('The confidence interval for the difference of true means is: (%6.3f,%6.3f)\n',limit1, limit2);
