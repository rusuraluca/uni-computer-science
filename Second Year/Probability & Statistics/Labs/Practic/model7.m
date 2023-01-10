clc 
clear all
pkg load statistics

alpha = 0.05; % 5% significance level
brand_a = [21.8 22.6 21.0 19.7 21.9 21.6 22.5 23.1 22.2 20.1 21.4 20.5];
brand_b = [36.5 35.2 36.2 34.0 36.4 36.1 37.5 38.0 36.3 35.9 35.7 34.9];

n1 = length(brand_a);
n2 = length(brand_b);

% a)

% The null hypothesis is H0: sigma1^2 = sigma2^2 (the variances are equal)
% The alternative/research hypothesis is H1: sigma1^2 != sigma2^2 (the variances are not equal)
% Hence, we will do a two-tailed test
disp("---> We are solving the first part of the problem");
disp(" We are using a two-tailed test for the equality of variances");

% the value of h is:
%   -> 1 if H0 is rejected
%   -> 0 if H0 is not rejected
% pval - the P-value of the test, the probability of observing a test statistic as extreme as or more extreme
%        than the observed value under the null hypothesis
% ci - the confidence interval for the ratio of population variances
% stats - a structure containing the following elements: 
%   -> fstat - the value of the test statistic, 
%   -> df1 and df2 - degrees of freedom for the test
[h, pval, ci, stats] = vartest2(brand_a, brand_b, "alpha", alpha, "tail", "both");

if(h == 0)
  fprintf("-> H0 is not rejected, the population variances are equal\n");
else
  fprintf("-> H0 is rejected, the population variances differ\n");
endif

if alpha < pval
  disp('-> We accept H0 (2nd method, using P-value)');
else
  disp('-> We reject H0 (2nd method, using P-value)');
end

q1 = finv(alpha / 2, n1 - 1, n2 - 1);     % quantile of order alpha / 2 for F(n1 - 1,n2 - 1)
q2 = finv(1 - alpha / 2, n1 - 1, n2 - 1); % quantile of order 1 - alpha / 2 for F(n1 - 1,n2 - 1)

fprintf(" The rejection region is: (-inf, %3.4f) U (%3.4f, inf)\n", q1, q2);
fprintf(" The value of the test statistic is: %1.4f\n", stats.fstat);
fprintf(" The p-value of the test is %1.4f\n", pval);

% b)

% From point a) we know that the variances are equal and obv unknown. Taking into consideration also the normality of the 2 populations,
% we are in the case when the variances of the population are unknown, but they are known to be equal
% Also notice that alpha is already correctly set: alpha = 0.05, because we want to find a 95% confidence interval
disp("---> We are solving the second part of the problem");

m_1 = mean(brand_a); % we compute the average of the first sample
m_2 = mean(brand_b);  % we compute the average of the second sample
v_1 = var(brand_a);  % we compute the variance of the first sample
v_2 = var(brand_b);  % we compute the variance of the second sample
n_1 = length(brand_a); 
n_2 = length(brand_b); 
t = tinv(1 - alpha / 2, n_1 + n_2 - 2); % inverse of the CDF of the T(n1 + n2 - 2) distribution
s_p2 = ((n_1 - 1) * v_1 + (n_2 - 1) * v_2) / (n_1 + n_2 - 2);
d_L = m_1 - m_2 - t * sqrt(s_p2) * sqrt(1 / n_1 + 1 / n_2); % left-part of the CI
d_R = m_1 - m_2 + t * sqrt(s_p2) * sqrt(1 / n_1 + 1 / n_2); % right-part of the CI  
fprintf('-> CI for difference of the average printing times is (%4.2f,%4.2f)\n', d_L, d_R)
