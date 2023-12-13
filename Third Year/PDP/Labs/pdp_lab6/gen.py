import sys, getopt
from random import randint, shuffle

NT = {
    "small" : [2, 10],
    "medium" : [10, 12],
    "large" : [12, 15]
}

def generate(type, inputFile, options):
    N = NT[type]
    n = randint(N[0], N[1])
    m = randint(n, n * (n - 1))
    f = open(inputFile, "w")
    p = list(range(1, n + 1))
    e = list(zip(p, p[1:] + p[:1]))
    print(e)
    if options == "cycle":
        for i in range(m - n):
            x = randint(1, n)
            y = randint(1, n)
            while x == y or (x, y) in e:
                x = randint(1, n)
                y = randint(1, n)
            e.append((x, y))
    else:
        e = e[:-1]
        m = len(e)
    f.write(str(n) + " " + str(m) + "\n")
    shuffle(e)
    for edg in e:
        f.write(str(edg[0]) + " " + str(edg[1]) + "\n")
    f.close()

for i in range(0, 5):
    generate("small", f"input/{i}.in", "cycle")
for i in range(5, 10):
    generate("medium", f"input/{i}.in", "cycle")
for i in range(10, 15):
    generate("large", f"input/{i}.in", "cycle")
generate("small", f"input/15.in", "")
generate("medium", f"input/16.in", "")
generate("large", f"input/17.in", "")