%alpha = input('significance level (0,1) = ');
alpha = 0.05;

%h0: sigma1  = sigma2
%h1: sigma1 =! sigma2 - two-tailed test

X1 = [4.6 0.7 4.2 1.9 4.8 6.1 4.7 5.5 5.4]; %sample test 1
X2 = [2.5 1.3 2.0 1.8 2.7 3.2 3.0 3.5 3.4]; %sample test 2

%tail values: -1 for left tailed
%           : 0 for both, default
%           : 1 for rigth tailed
tail = 0;
[h, p, ci, stats] = vartest2(X1,X2,alpha,tail);
%p-P value; ci = confidence level

fprintf('\n\npoint a !\n');

if h == 0
    fprintf('H0 is not rejected, i.e, sigmas are equal\n');
else 
    fprintf('H0 is rejected, population variances differ \n');
end

q1 = finv(alpha/2, stats.df1, stats.df2);
q2 = finv(1-alpha/2, stats.df2, stats.df1);
fprintf('Observed value is %1.4f\n', stats.fstat);
fprintf('P-value is %1.4f\n', p);
fprintf('Rejection region R is (-inf, %3.4f) U (%3.4f, inf)\n', q1, q2);

fprintf('\n\npoint b !\n');

% b.
%h0: miu1  = miu2
%h1: miu1 > miu2 - rigth-tailed test

[h, p, ci, stats] = ttest2(X1, X2, alpha, 1,'unequal');
%vartype - unequal (bcs in point a. we got different values for population
%variances. If they were equal, we would have used 'equal' parameter.
%p-P value; ci = confidence level

if h==0
  fprintf('H0 is not rejected. Steel pipes do NOT lose more heat than glass.\n')
else
  fprintf('H0 is rejected. Steel pipes DO lose more heat than glass pipes.\n')
end

fprintf('P-value of the test statistic is %e.\n', p)
fprintf('Observed value of the test statistic is %1.4f.\n', stats.tstat)

q1 = tinv(1-alpha, stats.df);

fprintf('Rejection region R is (%3.4f, +inf)\n', q1)
fprintf('\n\n\n\n');