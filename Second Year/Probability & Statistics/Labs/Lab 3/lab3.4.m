pkg load statistics

# alpha = 0.5 and beta = 0.6
alpha = input("alpha = ");
beta = input("beta = ");

# option = normal/ student/ fischer
option = input("distribution = ", 's');

switch option
  case 'normal'
    # mu = 1 and sigma = 5
    mu = input("mu = ");
    sigma = input("sigma = ");

    # a)
    P1 = normcdf(0, mu, sigma);
    P2 = 1 - P1;

    # b)
    P3 = normcdf(1, mu, sigma) - normcdf(-1, mu, sigma);
    P4 = 1 - P3;

    # c)
    P5 = norminv(alpha, mu, sigma);

    # d)
    P6 = norminv(1 - beta, mu, sigma);
  case 'student'
    # n = 10
    n = input("n = ");

    # a)
    P1 = tcdf(0, n);
    P2 = 1 - P1;

    # b)
    P3 = tcdf(0, n) - tcdf(0, n);
    P4 = 1 - P3;

    # c)
    P5 = tinv(alpha, n);

    # d)
    P6 = tinv(1 - beta, n);
  case 'fischer'
    # n = 10 and m = 15
    n = input("n = ");
    m = input("m = ");

    # a)
    P1 = fcdf(0, n, m);
    P2 = 1 - P1;

    # b)
    P3 = fcdf(0, n, m) - fcdf(0, n, m);
    P4 = 1 - P3;

    # c)
    P5 = finv(alpha, n, m);

    # d)
    P6 = finv(1 - beta, n, m);
otherwise
  # print an error
  fprintf('Error');

end;

fprintf('P1 = %1.4f\n', P1)
fprintf('P2 = %1.4f\n', P2)
fprintf('P3 = %1.4f\n', P3)
fprintf('P4 = %1.4f\n', P4)
fprintf('P5 = %1.4f\n', P5)
fprintf('P6 = %1.4f\n', P6)

