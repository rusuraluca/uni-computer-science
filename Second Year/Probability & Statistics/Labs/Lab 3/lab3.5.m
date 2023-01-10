pkg load statistics

# a)
# p = 0.5
p = input("Probability: ");

# n is the number of trials
for n = 1:3:100;
  # k is the number of successes
  k = 0:n
  prob = binopdf(k, n, p);

  plot(k, prob);
    xlim([0, 100]);
    ylim([0, 0.15]);
  pause(0.01);
end;

# b)
# n = 30 and p = 0.1
n = input("n = ");
p = input("p = ");

lambda = n * p;
k = 0:n

P1 = poisspdf(k, lambda);
P2 = binopdf(k, n, p);

plot(k, P1, k, P2);
