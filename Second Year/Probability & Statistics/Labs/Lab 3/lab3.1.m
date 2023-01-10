x=input('Give a distribution:', 's')

switch(x)
  case 'normal'
      mu = input('Give mu:');
      sigma = input('Give sigma:');

      %a
      p1 = normcdf(0, mu, sigma);
      p2 = 1 - normcdf(0, mu, sigma);

      %b
      pb1 = normcdf(1, mu, sigma) - normcdf(-1, mu, sigma);
      pb2 = 1 - pb1;

      %c
      alpha = input('Give alpha:');
      pc = norminv(alpha, mu, sigma);

      %d
      beta = input('Give beta:');
      pd = norminv(1-beta, mu, sigma);

  case 'student'
      n = input('Give n:');

      %a
      pa1 = tcdf(0, n);
      pa2 = 1-tcdf(0, n);

      %b
      pb1 = tcdf(1, n) - tcdf(-1, n);
      pb2 = 1 - pb1;

      %c
      alpha = input('Give alpha:');
      pc = tinv(alpha, mu, sigma);

      %d
      beta = input('Give beta:');
      pd = tinv(1-beta, mu, sigma);

  case 'chi'
      n = input('Give n:');

      %a
      pa1 = chi2cdf(0, n);
      pa2 = 1-chi2cdf(0, n);

      %b
      pb1 = chi2cdf(1, n) - chi2cdf(-1, n);
      pb2 = 1 - pb1;

      %c
      alpha = input('Give alpha:');
      pc = chi2inv(alpha, mu, sigma);

      %d
      beta = input('Give beta:');
      pd = chi2inv(1-beta, mu, sigma);

  case 'fischer'
      n = input('Give n:');
      m = input('Give m:');

      %a
      pa1 = fcdf(0, m, n);
      pa2 = 1-fcdf(0, m, n);

      %b
      pb1 = fcdf(1, m, n) - fcdf(-1, m, n);
      pb2 = 1 - pb1;

      %c
      alpha = input('Give alpha:');
      pc = finv(alpha, mu, sigma);

      %d
      beta = input('Give beta:');
      pd = finv(1-beta, mu, sigma);

  otherwise
    fprintf("No such distribution!");
end

fprintf('a.1 %5.4f\n', pa1);
fprintf('a.2 %5.4f\n', pa2);
fprintf('b.1 %6.4f\n', pb1);
fprintf('b.2 %6.4f\n', pb2);
fprintf('c   %6.4f\n', pc);
fprintf('d   %6.4f\n', pd);
