%gunpowder ones
x = [1001.7, 975.0, 978.3, 988.3, 978.7, ...
988.9, 1000.3, 979.2, 968.9, 983.5, ...
999.2, 985.6];

n = length(x);
m = mean(x);
v= var(x);

%a
alpha = 0.05;
% The null hypothesis H0: mu = 995
% the alternative hypothesis H1: mu >995. This is a right-tailed test for mu.

fprintf('\n Right-tailed test for the mean (sigma unknown)\n')

m0b = 995;
% m0 is in this case 5.5.
[H, P, CI, stats] = ttest(x,m0b,"alpha",alpha,"tail","right"); % 1, for right-tailed

t1 = tinv(1 - alpha, n-1); % quantile for right-tailed test
RR = [t1, Inf]; % rejection region for right-tailed test
fprintf('\n H is %d', H)
if H==1
    fprintf('\n So the null hypothesis is rejected,\n') 
    fprintf('i.e. the data suggests that the average exceeds 995.\n')
else
    fprintf('\n So the null hypothesis is not rejected,\n')
    fprintf('i.e. the data suggests that the average DOES NOT exceed 995.\n')
end    
fprintf(' the confidence interval for mu is (%4.4f,%4.4f)\n', CI)
fprintf('the rejection region is (%4.4f,%4.4f)\n', RR)
fprintf('the value of the test statistic t is %4.4f\n', stats.tstat)
fprintf('the P-value of the test is %4.4f\n\n', P)

%b
alpha = 0.01;
q1 = chi2inv(1 - alpha/2, n - 1);
q2 = chi2inv(alpha/2, n - 1); % here we need BOTH quantiles, there's no more symmetry
v1 = (n - 1) * v/q1; 
v2 = (n - 1) * v/q2;
s1 = sqrt(v1); 
s2 = sqrt(v2);

%fprintf('c) conf. interval for variance (v1, v2) = (%4.3f, %4.3f)\n', v1, v2)
fprintf('b) conf. interval for st. deviation (s1, s2) = (%4.3f, %4.3f)\n\n', s1, s2)