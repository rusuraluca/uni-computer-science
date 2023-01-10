pkg load statistics

% 1 a) sigma known

% RR - rejection region
% H0: miu = 9
% H1: miu < 9
% sigma = 5

fprintf ("First problem: a)\n")

test statistics

x = [7,7,4,5,9,9,4,12,8,1,8,7,3,13,2,1,17,7,12,5,6,2,1,13,14,10,2,4,9,11,3,5,12,6,10,7];
miu = 9;
sigma = 5;
alfa = 0.05;
[h, p, ci, stat] = ztest(x, miu, sigma, 'alpha', alfa, 'tail', 'left')
% RR = (-inf, Halfa)

ttalfa = norminv(alfa)
%RR = (-inf, Halfa)
RR = [-inf, ttalfa]

if h == 1
  fprintf("The hyp is rejected\n")
else
  fprintf("Not rejected\n")
end

fprintf("RR = (%1.2f, %1.2f)\n", RR)
fprintf("The value of the statistic = %1.2f\n", stat)
fprintf("The p value = %1.2f\n", p)

fprintf ("\n\n")

% 1 b) sigma unknown
fprintf ("First problem: b)\n")

miu = 5.5;
% H0: miu = 5.5
% H1: miu > 5.5

[h, p, ci, stat] = ttest(x, miu, 'alpha', alfa, 'tail', 'right')
n = length(x);
RR = [tinv(1-alfa, n - 1), inf]

if h == 1
  fprintf("The hyp is rejected\n")
else
  fprintf("Not rejected\n")
end

fprintf("RR = (%1.2f, %1.2f)\n", RR)
fprintf("The value of the statistic = %1.2f\n", stat.tstat)
fprintf("The p value = %1.2f\n", p)
