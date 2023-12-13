from random import randint

def test_karasuba(tid, n):
  with open("tests/%dk.in" % tid, "w") as f:
    f.write("%d\n" % n)
    for i in range(n):
      f.write("%d " % 1)
    f.write("\n")
    for i in range(n):
      f.write("%d " % 1)

test_karasuba(11, 100000)

"""
from random import randint
def test_karasuba(tid, n):
  with open("tests/%dk.in" % tid, "w") as f:
    f.write("%d\n" % n)
    for i in range(n):
      f.write("%d " % randint(100000, 10000000))
    f.write("\n")
    for i in range(n):
      f.write("%d " % randint(100000, 10000000))

test_karasuba(10, 900000)


from random import randint

T = [10, 50, 100, 500, 1000, 2000, 5000, 10000, 100000, 250000]
N = [10, 50, 100, 500, 1000, 2000, 5000, 10000, 100000]

def test(tid, n):
  with open("tests/%d.in" % tid, "w") as f:
    f.write("%d\n" % n)
    for i in range(n):
      f.write("%d " % randint(1, 100))
    f.write("\n")
    for i in range(n):
      f.write("%d " % randint(1, 100))

def test_karasuba(tid, n):
  with open("tests/%dk.in" % tid, "w") as f:
    f.write("%d\n" % n)
    for i in range(n):
      f.write("%d " % randint(100000, 10000000))
    f.write("\n")
    for i in range(n):
      f.write("%d " % randint(100000, 10000000))

for i, t in enumerate(T):
  print("%d %d" % (i, t))
  test(i, t)

for i, t in enumerate(N):
  print("%d %d" % (i, t))
  test_karasuba(i, t)
"""