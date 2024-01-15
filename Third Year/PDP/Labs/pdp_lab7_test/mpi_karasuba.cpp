#include <iostream>
#include <fstream>
#include <vector>
#include <mpi.h>
#include <time.h>
#include <stdint.h>
#include <stdio.h>
#include <assert.h>

using namespace std;

const int MAXVALUE = 100;

void brute(int *a, int *b, int *ret, int n) {
    for (int i = 0; i < 2 * n; ++i) {
        ret[i] = 0;
    }
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            ret[i + j] += a[i] * b[j];
        }
    }
}

void karatsuba(int *a, int *b, int *ret, int n) {
    if (n <= 4) {
        brute(a, b, ret, n);
        return;
    }

    int i;
    int *ar = &a[0];                 // low-order half of a
    int *al = &a[n / 2];             // high-order half of a
    int *br = &b[0];                 // low-order half of b
    int *bl = &b[n / 2];             // high-order half of b
    int *asum = &ret[n * 5];         // sum of a's halves
    int *bsum = &ret[n * 5 + n / 2]; // sum of b's halves
    int *x1 = &ret[n * 0];           // ar*br's location
    int *x2 = &ret[n * 1];           // al*bl's location
    int *x3 = &ret[n * 2];           // asum*bsum's location

    for (i = 0; i < n / 2; i++) {
        asum[i] = al[i] + ar[i];
        bsum[i] = bl[i] + br[i];
    }

    karatsuba(ar, br, x1, n / 2);
    karatsuba(al, bl, x2, n / 2);
    karatsuba(asum, bsum, x3, n / 2);

    for (i = 0; i < n; i++)
        x3[i] = x3[i] - x1[i] - x2[i];
    for (i = 0; i < n; i++)
        ret[i + n / 2] += x3[i];
}

void generate_poly(vector<int> &a, vector<int> &b, unsigned n) {
    a.resize(n);
    b.resize(n);
    for (int i = 0; i < n; ++i) {
        a[i] = rand() % MAXVALUE;
        b[i] = rand() % MAXVALUE;
    }
}

inline void send_work(vector<int> &a, vector<int> &b, int nrProcs) {
    cerr << "> master sends work\n";
    int n = a.size();
    for (int i = 1; i < nrProcs; ++i) {
        int st = i * n / nrProcs;
        int dr = min(n, (i + 1) * n / nrProcs);
        MPI_Bsend(&n, 1, MPI_INT, i, 0, MPI_COMM_WORLD);
        MPI_Bsend(&st, 1, MPI_INT, i, 1, MPI_COMM_WORLD);
        MPI_Bsend(&dr, 1, MPI_INT, i, 2, MPI_COMM_WORLD);
        MPI_Bsend(a.data() + st, dr - st, MPI_INT, i, 3, MPI_COMM_WORLD);
        MPI_Bsend(b.data(), n, MPI_INT, i, 4, MPI_COMM_WORLD);
    }
    cerr << "> master sent work\n";
}

inline void do_it(int st, int dr, vector<int> &a, vector<int> &b, vector<int> &res) {
    cerr << "> do it " << st << ' ' << dr << "\n";
    karatsuba(a.data(), b.data(), res.data(), a.size());
    cerr << "> done it\n";
}

inline void collect(int n, int nrProcs, vector<int> &res) {
    cerr << "> master collect\n";
    vector<int> aux(2 * n - 1);
    for (int i = 1; i < nrProcs; ++i)
    {
        MPI_Status _;
        int st = i * n / nrProcs;
        int dr = min(n, (i + 1) * n / nrProcs);
        MPI_Recv(aux.data(), 2 * n - 1, MPI_INT, i, 5, MPI_COMM_WORLD, &_);
        for (int i = 0; i < 2 * n - 1; ++i)
        {
            res[i] += aux[i];
        }
    }
    cerr << "> master collected\n";
}

inline void check(vector<int> &a, vector<int> &b, vector<int> &res) {
    cerr << "> master check\n";
    vector<int> check(a.size() + b.size() - 1, 0);
    for (int i = 0; i < a.size(); ++i)
    {
        for (int j = 0; j < b.size(); ++j)
        {
            check[i + j] += a[i] * b[j];
        }
    }
    assert(check.size() == res.size());
    for (int i = 0; i < check.size(); ++i) {
        assert(check[i] == res[i]);
    }
    cerr << "> master checked\n";
}

inline void slave(int me) {
    cerr << "> slave(" << me << ") started\n";
    int n;
    int st;
    int dr;
    MPI_Status _;
    MPI_Recv(&n, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &_);
    MPI_Recv(&st, 1, MPI_INT, 0, 1, MPI_COMM_WORLD, &_);
    MPI_Recv(&dr, 1, MPI_INT, 0, 2, MPI_COMM_WORLD, &_);
    vector<int> a(n, 0);
    vector<int> b(n, 0);
    MPI_Recv(a.data() + st, dr - st, MPI_INT, 0, 3, MPI_COMM_WORLD, &_);
    MPI_Recv(b.data(), n, MPI_INT, 0, 4, MPI_COMM_WORLD, &_);
    vector<int> res(6 * n, 0);
    do_it(st, dr, a, b, res);
    MPI_Bsend(res.data(), 2 * n - 1, MPI_INT, 0, 5, MPI_COMM_WORLD);
    cerr << "> slave(" << me << ") finished\n";
}

int main2(int argc, char *argv[]) {
    MPI_Init(0, 0);

    int me;
    int nrProcs;
    MPI_Comm_size(MPI_COMM_WORLD, &nrProcs);
    MPI_Comm_rank(MPI_COMM_WORLD, &me);

    unsigned int n;
    vector<int> a, b;

    if (argc != 2 || 1 != sscanf(argv[1], "%u", &n)) {
        fprintf(stderr, "usage: mpi_kar <n>\n");
        return 1;
    }

    if (me == 0) {
        generate_poly(a, b, n);
        while (n & (n - 1)) {
            ++n;
            a.push_back(0);
            b.push_back(0);
        }
        fprintf(stderr, "> master: input generated\n");
        fprintf(stderr, "> master: sending work to slaves\n");
        send_work(a, b, nrProcs);
        int st = 0;
        int dr = n / nrProcs;
        vector<int> aux(a);
        for (int i = dr; i < aux.size(); ++i) {
            aux[i] = 0;
        }
        vector<int> res(6 * n);
        do_it(st, dr, aux, b, res);
        collect(n, nrProcs, res);
        res.resize(2 * n - 1);
        check(a, b, res);
    }
    else {
        slave(me);
    }

    MPI_Finalize();
}