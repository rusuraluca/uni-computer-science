pkg load statistics;
alpha = 0.05;
premium = [22.4 21.7 24.5 23.4 21.6 23.3 22.4 21.6 24.8 20.0];
regular = [17.7 14.8 29.6 29.6 12.1 14.8 15.4 12.6 14.0 12.2];
n1 = length(premium);
n2 = length(regular);
%a
% The null hypothesis is H0: sigma1^2 = sigma2^2 (the variances are equal)
% The alternative hypothesis is H1: sigma1^2 != sigma2^2 (the variances are not equal)
% We will do a two-tailed test
disp("We are solving the first part of the second problem");
disp("We are using a two-tailed test for the equality of variances");

[h, pval, ci, stats] = vartest2(premium, regular, "alpha", alpha, "tail", "both");

% h - 1 if H0 is rejected, 0 if H0 is not rejected
% pval - the P-value of the test, the probability of observing a test statistic as extreme as
% or more extreme than the observed value under the null hypothesis
% ci - the confidence interval for the ratio of population variances
% stats - a structure containing 
%         - fstat - the value of the test statistic, 
%         - df1 and df2 - degrees of freedom for the test

if(h == 0)
  fprintf("H0 is not rejected, the population variances are equal\n");
else
  fprintf("H0 is rejected, the population variances differ\n");
endif

q1 = finv(alpha/2, stats.df1, stats.df2);
q2 = finv(1-alpha/2, stats.df1, stats.df2);

fprintf("The rejection region is: (-inf, %3.4f) U (%3.4f, inf)\n", q1, q2);
fprintf("The value of the test statistic is: %1.4f\n", stats.fstat);
fprintf("The p-value of the test is %1.4f\n", pval);


%b
% The null hypothesis is H0: miu1 = miu2 (the means are equal)
% The alternative hypothesis is H1: miu1 > miu2 (the mean of the premium mileage is higher than the mean of the regular mileage)
% We will do a right-tailed test

fprintf("\n\n\n");
fprintf("We are solving the second part of the problem\n");
fprintf("We are using a right tailed test for the equality of means when the variances are unequal\n");

[h, pval, ci, stats] = ttest2(premium, regular, "alpha", alpha, "tail", "right", "vartype", "unequal");

% h - 1 if H0 is rejected, 0 if H0 is not rejected
% pval - the P-value of the test, the probability of observing a test statistic as extreme as
% or more extreme than the observed value under the null hypothesis
% ci - the confidence interval for the ratio of population variances
% stats - a structure containing 
%         - tstat - the value of the test statistic, 
%         - df - degrees of freedom for the test
%         - sd - estimates of the population standared deviations

if(h == 0)
  fprintf("H0 is not rejected, gas mileage does not seem higher on average for premium gasoline\n");
else
  fprintf("H0 is rejected, gas mileage seems higher on average for premium gasoline\n");
endif

q1 = tinv(1-alpha, n1 + n2 - 2);

fprintf("The rejection region is (%3.4f, inf)\n", q1);
fprintf("The value of the test statistic is: %1.4f\n", stats.tstat);
fprintf("The p-value of the test is %1.4f\n", pval);