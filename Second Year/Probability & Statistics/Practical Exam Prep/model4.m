%10

x1 = [1021, 980, 1017, 988, 1005, 998, 1014, ...
985, 1004, 1030, 1015, 995, 1023];
x2 = [1070, 970, 993, 1013, 1006, 1002, ...
1014, 997, 1002, 1010, 975];

n1 = length(x1);
n2 = length(x2);

m1 = mean(x1);
m2 = mean(x2);

v1 = var(x1);
v2 = var(x2);

%a
alpha = 0.05;
% The null hypothesis H0: sigma1^2 = sigma2^2
% The alt. hypothesis H1:  sigma1^2 != sigma2^2

% two-tailed for comparing the variances

q1 = tinv(alpha/2, n1+ n2-2);
q2 = tinv(1- alpha/2, n1 + n2 - 2);

[h, p, ci, stats] = vartest2(x1, x2, "alpha", alpha);
fprintf('Two-tailed test for comparing variances\n')
if H == 0
    fprintf('H is %d\n', H)
    fprintf('So the null hypothesis is not rejected,\n')
    fprintf('i.e. the variances seem to be equal\n')
    fprintf('the rejection region for F is (%6.4f, %6.4f) U (%6.4f, %6.4f)\n', -inf, q1, q2, inf)
    fprintf('the value of the test statistic F is %6.4f\n', stats.fstat)
    fprintf('the P-value for the variances test is %6.4f\n', P)
else
    fprintf('H is %d\n', H)
    fprintf('So the null hypothesis is rejected,\n')
    fprintf('i.e. the variances seem to differ\n')
    fprintf('the rejection region for F is (%6.4f,%6.4f)U(%6.4f,%6.4f)\n', -inf, q1, q2, inf)
    fprintf('the value of the test statistic F is %6.4f\n', stats.fstat)
    fprintf('the P-value for the variances test is %6.4f\n', P)
end
 
 
 %b
 %in our case the hyp is rejected
 % part b. 
% The null hypothesis H0: mu1 = mu2
% The alt. hypothesis H1: mu1 > mu2
% right-tailed for the difference of means 
  c = (v1/n1)/(v1/n1 + v2/n2);
  n = c^2/(n1 - 1) + (1 - c)^2/(n2 - 1);
  n = 1/n;
  t2 = tinv(1 - alpha, n); % quantile for right-tailed test (for rejection region)
  [hh, pp2, ci2, stats] = ttest2(x1, x2, 'alpha', alpha, 'tail', 'right', 'vartype','unequal'); % option "unequal" if variances are not equal
  fprintf('\n part b. Comparing means when variances are not equal\n')
  fprintf('Right-tailed test for the difference of means\n')
  fprintf(' hh is %d\n', hh)
  if hh==1
      fprintf('So the null hypothesis is rejected,\n') 
      fprintf('i.e. supplier A IS more reliable\n')
  else
      fprintf('So the null hypothesis is not rejected,\n')
      fprintf('i.e. supplier A IS NOT more reliable\n')
  end    
  fprintf('the rejection region for T is (%6.4f,%6.4f)\n', t2, inf)
  fprintf('the value of the test statistic T is %6.4f\n', stats.tstat)
  fprintf('the P-value of the test for diff. of means is %e\n', pp2)

 
 
 
 
 