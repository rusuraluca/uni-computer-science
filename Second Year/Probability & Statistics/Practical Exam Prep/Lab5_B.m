pkg load statistics

% we are solving problem 1 from part b
x = [7 7 4 5 9 9 4 12 8 1 8 7 3 13 2 1 17 7 12 5 6 2 1 13 14 10 2 4 9 11 3 5 12 6 10 7];
n = length(x);
conf_level = input("Give the confidence level:"); 
alpha = 1-conf_level; %significance level
x_mean = mean(x); %the mean of the sample
sigma = 5; % standard deviation given by past experience

disp("a");
disp("We will compute the confidence interval for the population mean when we 
have a normal underlying population and we know sigma");
l_part_a = x_mean - sigma / sqrt(n) * norminv(1 - alpha / 2, 0, 1);
r_part_a = x_mean - sigma / sqrt(n) * norminv(alpha / 2, 0, 1);
disp(l_part_a);
disp(r_part_a);

disp("b");
disp("We will compute the confidence interval for the population mean when we 
don't know sigma and we have a normal underlying population");
l_part_b = x_mean - std(x) / sqrt(n) * tinv(1 - alpha / 2, n - 1);
r_part_b = x_mean - std(x) / sqrt(n) * tinv(alpha / 2, n - 1);
disp(l_part_b);
disp(r_part_b);

disp("c");
disp("We will compute the confidence interval for the population variance when 
the underlying population is normal.");
l_part_c_variance = (n-1) * var(x) / chi2inv(1 - alpha / 2, n - 1);
r_part_c_variance = (n-1) * var(x) / chi2inv(alpha / 2, n - 1);
l_part_c_deviation = sqrt(l_part_c_variance);
r_part_c_deviation = sqrt(r_part_c_variance);
disp("variance");
disp(l_part_c_variance);
disp(r_part_c_variance);
disp("The standard deviation is given by the square root of the variance, so we 
use this to compute the confidence interval.");
disp("standard deviation");
disp(l_part_c_deviation);
disp(r_part_c_deviation);

%we are solving problem 2 from part b
pkg load statistics;
premium = [22.4 21.7 24.5 23.4 21.6 23.3 22.4 21.6 24.8 20.0];
regular = [17.7 14.8 29.6 29.6 12.1 14.8 15.4 12.6 14.0 12.2];
n1 = length(premium);
n2 = length(regular);
conf_level = input("Give the confidence level:"); 
alpha = 1-conf_level; %significance level
premium_mean = mean(premium); % sample mean for the premium
regular_mean = mean(regular); % sample mean for the regular 
premium_variance = var(premium); % sample variance for the premium
regular_variance = var(regular); % sample variance for the regular
disp("a");
disp("We will compute the confidence interval for the difference of the 
population means when we have the standard deviations equal and unknown.");
overall_deviation = sqrt(((n1-1)*premium_variance + (n2-1)*regular_variance)/(n1+n2-2));
l_part_a = premium_mean - regular_mean-tinv(1-alpha/2, n1+n2-2) * overall_deviation * sqrt(1/n1 + 1/n2);
r_part_a = premium_mean - regular_mean+tinv(1-alpha/2, n1+n2-2) * overall_deviation * sqrt(1/n1 + 1/n2);
disp(l_part_a);
disp(r_part_a);

disp("b");
disp("We will compute the confidence interval for the difference of the 
population means when we have the standard deviations unequal and unknown.");
c = premium_variance/n1 / (premium_variance/n1 + regular_variance/n2);
n = 1/(c^2/(n1-1) + (1-c)^2/(n2-1));
l_part_b = premium_mean - regular_mean-tinv(1-alpha/2, n) * sqrt(premium_variance/n1 + regular_variance/n2);
r_part_b = premium_mean - regular_mean+tinv(1-alpha/2, n) * sqrt(premium_variance/n1 + regular_variance/n2);
disp(l_part_b);
disp(r_part_b);

disp("c");
disp("We will the confidence interval for the ratio of the population variances 
for normal underlying populations and independent samples");
l_part_c = 1 / finv(1-alpha/2, n1-1, n2-1) * premium_variance / regular_variance;
r_part_c = 1 / finv(alpha/2, n1-1, n2-1) * premium_variance / regular_variance;
disp(l_part_c);
disp(r_part_c);

