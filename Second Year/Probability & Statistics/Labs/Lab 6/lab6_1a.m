clear
x = [7 7 4 5 9 9 4 12 8 1 8 7 3 13 2 1 17 7 12 5 6 2 1 13 14 10 2 4 9 11 3 5 12 6 10 7];
n = length(x);
 
% a) sigma known
alpha = input('significance level = '); 
m = input('testing value = ');
sigma = 5;
tail = -1;

[H, P, CI, ZVAL] = ztest(x, m, sigma, alpha, tail);

% result of the test, 
% H = 0, if H0 is NOT rejected
% H = 1, if H0 IS rejected
if H == 1 
    fprintf('\n null hypothesis IS rejected\n') 
    fprintf('data suggests standard IS NOT met\n')
else
    fprintf('\n null hypothesis IS NOT rejected\n')
    fprintf('data suggests standard IS met\n')
end

fprintf('\nZVAL is %.4f\n', ZVAL)
fprintf('P is %.4f\n', P)
fprintf('H is %1.0f\n', H)
fprintf('CI is %.4f, %.4f)\n', CI)

RR = [-inf, norminv(alpha)];
fprintf('rejection region is (%.4f, %.4f)\n', RR)
