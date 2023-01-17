
%sample
x = [3.26, 1.89, 2.42, 2.03, 3.07, 2.95, 1.39, 3.06, 2.46 ...
3.35, 1.56, 1.79, 1.76, 3.82, 2.42, 2.96];
n = length(x);

%a
oneminusalpha = 0.95;
%significance level
alpha = 1 - oneminusalpha;

%sigma not known
samp_std = std(x); % we use the sample std. dev.

% limits of the confidence interval
m1b = mean(x) + tinv(alpha/2, n - 1) * samp_std/sqrt(n);
m2b = mean(x) - tinv(alpha/2, n - 1) * samp_std/sqrt(n);

fprintf('the confidence interval for the mean (sigma unknown) is: (m1b, m2b) = (%4.3f ,%4.3f)\n',m1b, m2b)

%b
alpha = 0.01;

%The null hypothesis H0: miu = 3
%The alternative hypothesis H1: miu < 3
%left tailed test
m0 = 3;
[H, P, CI, stats] = ttest(x,m0,"alpha",alpha,"tail","left");

q = tinv(alpha, n-1);
RR = [-inf, q];

fprintf("\nH is %d", H)
if H==1
    fprintf('\n So the null hypothesis is rejected,\n') 
    fprintf('i.e. the data suggests that the average is lower than 3.\n')
else
    fprintf('\n So the null hypothesis is not rejected,\n')
    fprintf('i.e. the data suggests that the average is smaller than 3.\n')
end    
fprintf(' the confidence interval for mu is (%4.4f,%4.4f)\n', CI)
fprintf('the rejection region is (%4.4f,%4.4f)\n', RR)
fprintf('the value of the test statistic t is %4.4f\n', stats.tstat)
fprintf('the P-value of the test is %4.4f\n\n', P)

