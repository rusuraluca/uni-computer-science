pkg load statistics

% we are solving problem 1 from part b
x = [3.26 1.89 2.42 2.03 3.07 2.95 1.39 3.06 2.46 3.35 1.56 1.79 1.76 3.82 2.42 2.96];
n = length(x);
conf_level = 0.95;
alpha = 1-conf_level; %significance level
x_mean = mean(x); %the mean of the sample

disp("b");
disp("We will compute the confidence interval for the population mean when we don't know sigma and we have a normal underlying population");
l_part_b = x_mean - std(x) / sqrt(n) * tinv(1 - alpha / 2, n - 1);
r_part_b = x_mean - std(x) / sqrt(n) * tinv(alpha / 2, n - 1);
fprintf('The confidence interval for mean in the second case is (%4.2f,%4.2f)\n', l_part_b, r_part_b)