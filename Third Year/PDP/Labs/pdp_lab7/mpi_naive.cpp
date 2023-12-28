#include <iostream>
#include <mpi.h>
#include <vector>
#include <time.h>
#include <stdint.h>
#include <stdio.h>
#include <assert.h>

using namespace std;

const int MAXVALUE = 100;

void generate(vector<int> &a, vector<int> &b, unsigned n) {
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
    int l = a.size() + b.size() - 1;
    for (int i = 1; i < nrProcs; ++i) {
        int st = i * l / nrProcs;
        int dr = min(l, (i + 1) * l / nrProcs);
        MPI_Bsend(&n, 1, MPI_INT, i, 0, MPI_COMM_WORLD);
        MPI_Bsend(&st, 1, MPI_INT, i, 1, MPI_COMM_WORLD);
        MPI_Bsend(&dr, 1, MPI_INT, i, 2, MPI_COMM_WORLD);
        MPI_Bsend(a.data(), min(dr, n), MPI_INT, i, 3, MPI_COMM_WORLD);
        MPI_Bsend(b.data(), min(dr, n), MPI_INT, i, 4, MPI_COMM_WORLD);
    }
    cerr << "> master sent work\n";
}

inline void do_it(int st, int dr, const vector<int> &a, const vector<int> &b, vector<int> &res) {
    cerr << "> do it " << st << ' ' << dr << "\n";
    for (int i = st; i < dr; ++i) {
        for (int x = 0; x <= min(int(a.size()) - 1, i); ++x) {
            int y = i - x;
            if (y >= b.size()) {
                continue;
            }
            res[i - st] += a[x] * b[y];
        }
    }
    cerr << "> done it\n";
}

inline void collect(int nrProcs, vector<int> &res) {
    cerr << "> master collect\n";
    int l = res.size();
    for (int i = 1; i < nrProcs; ++i) {
        MPI_Status _;
        int st = i * l / nrProcs;
        int dr = min(l, (i + 1) * l / nrProcs);
        MPI_Recv(res.data() + st, dr - st, MPI_INT, i, 5, MPI_COMM_WORLD, &_);
    }
    cerr << "> master collected\n";
}

inline void check(vector<int> &a, vector<int> &b, vector<int> &res) {
    cerr << "> master check\n";
    vector<int> check(a.size() + b.size() - 1, 0);
    for (int i = 0; i < a.size(); ++i) {
        for (int j = 0; j < b.size(); ++j) {
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
    vector<int> a(dr);
    vector<int> b(dr);
    MPI_Recv(a.data(), min(dr, n), MPI_INT, 0, 3, MPI_COMM_WORLD, &_);
    MPI_Recv(b.data(), min(dr, n), MPI_INT, 0, 4, MPI_COMM_WORLD, &_);
    vector<int> res(dr - st, 0);
    do_it(st, dr, a, b, res);
    MPI_Bsend(res.data(), dr - st, MPI_INT, 0, 5, MPI_COMM_WORLD);
    cerr << "> slave(" << me << ") finished\n";
}

int main2(int argc, char **argv) {
    srand(time(NULL));
    MPI_Init(0, 0);
    int me;
    int nrProcs;
    MPI_Comm_size(MPI_COMM_WORLD, &nrProcs);
    MPI_Comm_rank(MPI_COMM_WORLD, &me);

    unsigned int n;
    vector<int> a, b;

    if (argc != 2 || 1 != sscanf(argv[1], "%u", &n)) {
        fprintf(stderr, "usage: mpi_naive <n>\n");
        return 1;
    }

    if (me == 0) {
        generate(a, b, n);
        fprintf(stderr, "> master: input generated\n");
        fprintf(stderr, "> master: sending work to slaves\n");
        send_work(a, b, nrProcs);
        int st = 0;
        int dr = (2 * n - 1) / nrProcs;
        vector<int> res(2 * n - 1);
        do_it(st, dr, a, b, res);
        collect(nrProcs, res);
        check(a, b, res);
    }
    else {
        slave(me);
    }
    MPI_Finalize();
}