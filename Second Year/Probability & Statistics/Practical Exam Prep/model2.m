%5
x1 = [46, 37, 39, 48, 47, 44, 35, 31, 44, 37];
x2 = [35, 33, 31, 35, 34, 30, 27, 32, 31, 31];

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
%from a we have that the variances differ so the standard 
%deviations (sigmas) are not equal
% part b.
%alpha remains 0.05 as 1-alpha is 0.95
mdiff = m1 - m2;
c = (v1 / n1)/(v1 / n1 + v2/n2);
nn = 1/(c^2/(n1 - 1) + (1 - c)^2/(n2 - 1));
s = sqrt(v1/n1+v2/n2);
qq=tinv(1 - alpha/2, nn);
mm1 = mdiff - qq * s; 
mm2 = mdiff + qq * s;
fprintf('b) Conf. interval for diff. of means, variances not equal (mm1, mm2) = (%4.3f, %4.3f)\n',mm1, mm2)
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 