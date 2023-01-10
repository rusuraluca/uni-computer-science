clc
clear all
pkg load statistics

brand_a = [29.8 30.6 29.0 27.7 29.9 29.6 30.5 31.1 30.2 28.1 29.4 28.5];
brand_b = [31.5 30.2 31.2 29.0 31.4 31.1 32.5 33.0 31.3 30.9 30.7 29.9];

alpha = 0.05;

% H0:  R (the ratio) = 1
% H0:  R (the ratio) =/= 1  (two-tailed test)

[H, PVAL, CI, STATS] = vartest2(brand_a, brand_b, 'alpha', alpha, 'tail', 'both');

n1 = length(brand_a);     
n2 = length(brand_b);     
t_1 = finv(alpha / 2, n1 - 1, n2 - 1);   %cuantile of order alpha/2 for F(n1-1,n2-1)
t_2 = finv(1 - alpha / 2, n1 - 1, n2 - 1); %cuantile of order 1-alpha/2 for F(n1-1,n2-1)
RR = [-inf, t_1, t_2, inf];         % rejection region
fprintf('H is %1d\n', H) ;      % if H=0 we accept H0 but if H=1 we reject H0
fprintf('TS_0 is %6.4f\n', STATS.fstat); % observed value of the test statistic F 
fprintf('RR is (%6.4f,%6.4f)U(%6.4f,%6.4f)\n', RR);
fprintf('P-value is %6.4f\n', PVAL);

if H==0
  disp('We accept H0 (1st method, using RR)')
  disp('The variances are equal')
else
  disp('We reject H0 (1st method, using RR)')
  disp('The variances are different')
end

if alpha < PVAL
  disp('We accept H0 (2nd method, using P)')
else
  disp('We reject H0 (2nd method, using P)')
end
