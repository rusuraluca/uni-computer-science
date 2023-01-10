pkg load statistics

% 2 a)
fprintf ("Second problem: a)\n")

% H0: (sigma1)^2 = (sigma2)^2
% H1: (sigma1)^2 != (sigma2)^2

premium = [22.4, 21.7, 24.5, 23.4, 21.6, 23.3, 22.4, 21.6, 24.8, 20.0];
regular = [17.7, 14.8, 19.6, 19.6, 12.1, 14.8, 15.4, 12.6, 14.0, 12.2];

n1 = length(premium);
n2 = length(regular);

[h, p, ci, stat] = vartest2(premium, regular, 'alpha', alfa, 'tail', 'both');
f1 = finv(alfa/2, n1-1, n2-1);

f2 = finv(1-alfa/2, n1-1, n2-1);

if h == 1
  fprintf("The hyp is rejected\n")
else
  fprintf("Not rejected\n")
end

fprintf("RR = (-inf, %1.2f) U (%1.2f, inf) \n", f1, f2)
fprintf("The value of the statistic = %1.2f\n", stat.fstat)
fprintf("The p value = %1.2f\n", p)

fprintf ("\n\n")

% 2 b) variances are equal based on the first subpoint
fprintf ("Second problem: b)\n")

% H0: miu1 = miu2
% H1: miu1 > miu2

[h, p, ci, stat] = ttest2(premium, regular, 'alpha', alfa, 'tail', 'right');
% RR = (tt1-alfa, inf)
tt1minualfa = tinv(1 - alfa, n1 + n2 - 2);
RR = [tt1minualfa, inf];

if h == 1
  fprintf("The hyp is rejected\n")
else
  fprintf("Not rejected\n")
end

fprintf("RR = (%1.2f, %1.2f)\n", RR)
fprintf("The value of the statistic = %1.2f\n", stat.tstat)
fprintf("The p value = %1.2f\n", p)
