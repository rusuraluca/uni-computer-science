n=input("n: ");
p=input("p: ");

% plot(0:n, pdf("Binomial", 0:n, n, p), 0:0.01:n, cdf("Binomial", 0:0.01:n, n, p))
% plot(0:n, pdf("Binomial", 0:n, n, p, '*'))
% hold on
% plot(0:0.1:n, cdf("Binomial", 0:0.1:n, n, p, 'd'))
% axis([-0.1, 3.2, -0.1, 1.1])
% hold off
% legend('P Distribution','Cumulative Distribution')

rc1 = pdf("Binomial", 0, n, p);
fprintf('%f\n', rc1)
rc2 = 1 - pdf("Binomial", 0:n, n, p);
fprintf('%f\n', rc2)

rd1 = cdf("Binomial", 2, n, p);
fprintf('%f\n',rd1)
rd2 = cdf("Binomial", 1, n, p);
fprintf('%f\n',rd2)

re1 = 1 - cdf("Binomial", 0.09, n, p);
fprintf('%f\n',re1)
re2 = 1 - cdf("Binomial",1, n, p);
fprintf('%f\n',re2)

heads = 0;
for k= 1 : n
       x = rand();
       if (x>=0.5)
           fprintf('h\n')
           heads = heads+1;
       else 
           fprintf('t\n')
       end
end
fprintf('X:')
fprintf('%f\n', binopdf(heads, 3, 0.5))



