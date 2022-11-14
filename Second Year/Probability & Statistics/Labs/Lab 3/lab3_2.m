p = input("p=");
if p <= 0.95 && p >= 0.05
    for n = 1 : 2 : 100
      k = 0 : n;
      plot(k, binopdf(k, n, p), k, normpdf(k, n*p, sqrt(n*p*(1-p))));
      pause(0.5);
    end
end