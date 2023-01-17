pkg load statistics;
alpha = input("Give alpha(significance level):")
X = [7 7 4 5 9 9 4 12 8 1 8 7 3 13 2 1 17 7 12 5 6 2 1 13 14 10 2 4 9 11 3 5 12 6 10 7];
n = length(X);
% The null hypothesis is H0 : population mean (miu) = 9
% The alternative hypothesis is H1 : population mean (miu) < 9
% We will do a left-tailed test
disp("We are solving the first part of the first problem");
disp("We are using a left-tailed test for the mean when we know sigma");
sigma = 5;
m0 = 9;
[h, pval, ci, z, zcrit] = ztest(X, m0, sigma, "alpha", alpha, "tail", "left");

% h - 1 if H0 is rejected, 0 if H0 is not rejected
% pval - the P-value of the test, the probability of observing a test statistic as extreme as
% or more extreme than the observed value under the null hypothesis
% ci - the confidence interval for the ratio of population variances
% z - the value of the test statistic
% zcrit - the z critical value

rejection_region = [-inf, norminv(alpha, 0, 1)];
disp("The value of h:");
disp(h);
if(h == 1)
  disp("The null hypothesis is rejected");
  disp("The data suggests that the standard is not met");
else
  disp("The null hypothesis is not rejected");
  disp("The data suggests that the standard is met");
endif
disp("The rejection region is the interval:")
disp(rejection_region);
disp("The value of the test statistic Z is:");
disp(z);
disp("The p-value of the test is:");
disp(pval);

%b
% The null hypothesis is H0: population mean (miu) = 5.5
% The alternative hypothesis is H1: population mean (miu) > 5.5
% We will do a right-tailed test
disp("We are solving the second part of the first problem");
disp("We are using a right-tailed test for the mean when we do not know sigma but we have a large sample");
m0 = 5.5;
[h, pval, ci, stats] = ttest(X, m0, "alpha", alpha, "tail", "right");
% h - 1 if H0 is rejected, 0 if H0 is not rejected
% pval - the P-value of the test, the probability of observing a test statistic as extreme as
% or more extreme than the observed value under the null hypothesis
% ci - the confidence interval for the ratio of population variances
% stats - a structure containing 
%         - tstat - the value of the test statistic, 
%         - df - degrees of freedom for the test
%         - sd - estimated population standard deviation
rejection_region = [norminv(1-alpha, 0, 1), inf];
disp("The value of h:");
disp(h);
if(h == 1)
  disp("The null hypothesis is rejected");
  disp("The data suggests that on average the number of files stored exceeds 5.5");
else
  disp("The null hypothesis is not rejected");
  disp("The data suggests that on average the number of files stored does not exceed 5.5");
endif
disp("The rejection region is the interval:")
disp(rejection_region);
disp("The value of the test statistic T is:");
disp(stats.tstat);
disp("The p-value of the test is:");
disp(pval);