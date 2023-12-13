#include <iostream>
#include <fstream>
#include <vector>
#include <ctime>
#include <thread>

using namespace std;

const int MAXT = 9;
int T = 0;

void mult_sec(const vector<int> &a, const vector<int> &b, vector<int> &sol){
    if (a.size() == 1 && b.size() == 1){
        sol[0] = a[0] * b[0];
        return;
    }

    if (a.size() < 100 && b.size() < 100){
        for (int i = 0; i < a.size(); ++i){
            for (int j = 0; j < b.size(); ++j){
                sol[i + j] += a[i] * b[j];
            }
        }
        return;
    }

    int half = a.size() / 2 + a.size() % 2;

    vector<int> a_lo(a.begin(), a.begin() + half);
    vector<int> a_hi(a.begin() + half, a.end());
    vector<int> b_lo(b.begin(), b.begin() + half);
    vector<int> b_hi(b.begin() + half, b.end());

    vector<int> lo(a_lo.size() + b_lo.size() - 1);
    vector<int> hi(a_hi.size() + b_hi.size() - 1);
    mult_sec(a_lo, b_lo, lo);
    mult_sec(a_hi, b_hi, hi);

    for (int i = 0; i < lo.size(); ++i){
        sol[i] += lo[i];
    }

    // (a+b)(c+d)
    for (int i = 0; i < a_hi.size(); ++i){
        a_lo[i] += a_hi[i];
        b_lo[i] += b_hi[i];
    }

    vector<int> mid(a_lo.size() + b_lo.size() - 1);
    mult_sec(a_lo, b_lo, mid);

    // (ad+bc)e = ((a+b)(c+d)-ac-bd)
    for (int i = 0; i < mid.size(); ++i){
        sol[i + half] += mid[i] - lo[i] - hi[i];
    }
    // copy high
    for (int i = 0; i < hi.size(); ++i){
        sol[i + 2 * half] += hi[i];
    }
}


void mult(const vector<int> &a, const vector<int> &b, vector<int> &sol){
    if (a.size() == 1 && b.size() == 1){
        sol[0] = a[0] * b[0];
        return;
    }

    int half = a.size() / 2 + a.size() % 2;

    vector<int> a_lo(a.begin(), a.begin() + half);
    vector<int> a_hi(a.begin() + half, a.end());
    vector<int> b_lo(b.begin(), b.begin() + half);
    vector<int> b_hi(b.begin() + half, b.end());


    vector<int> lo(a_lo.size() + b_lo.size() - 1);
    vector<int> hi(a_hi.size() + b_hi.size() - 1);
    vector<thread> th;

    T += 2;
    if (T < MAXT) {
        // start threads for mult
        th.push_back(thread([&a_lo, &b_lo, &lo]()
                            { mult(a_lo, b_lo, lo); }));
        th.push_back(thread([&a_hi, &b_hi, &hi]()
                            { mult(a_hi, b_hi, hi); }));
    } else {
        mult_sec(a_lo, b_lo, lo);
        mult_sec(a_hi, b_hi, hi);
    }

    vector<int> a_lo2(a_lo);
    vector<int> b_lo2(b_lo);
    for (int i = 0; i < a_hi.size(); ++i){
        a_lo2[i] += a_hi[i];
        b_lo2[i] += b_hi[i];
    }

    vector<int> mid(a_lo2.size() + b_lo2.size() - 1);
    T += 1;
    if (T < MAXT){
        th.push_back(thread([&a_lo2, &b_lo2, &mid]()
                            { mult(a_lo2, b_lo2, mid); }));
    } else {
        mult_sec(a_lo2, b_lo2, mid);
    }

    T -= th.size();
    for (int i = 0; i < th.size(); ++i){
        th[i].join();
    }

    for (int i = 0; i < lo.size(); ++i){
        sol[i] += lo[i];
    }

    for (int i = 0; i < mid.size(); ++i){
        sol[i + half] += mid[i] - lo[i] - hi[i];
    }

    for (int i = 0; i < hi.size(); ++i){
        sol[i + 2 * half] += hi[i];
    }
}

void extend_size(vector<int> &v, size_t n){
    while (n & (n - 1)){
        ++n;
    }
    v.resize(n);
}

void solve(string filename){
    clock_t t;
    t = clock();

    ifstream fin(filename);
    int n;
    vector<int> a, b;
    fin >> n;
    for (int i = 0; i < n; ++i){
        int x;
        fin >> x;
        a.push_back(x);
    }

    for (int i = 0; i < n; ++i){
        int x;
        fin >> x;
        b.push_back(x);
    }
    extend_size(a, a.size());
    extend_size(b, b.size());

    vector<int> sol(2 * n - 1);
    mult(a, b, sol);

    t = clock() - t;
    cout << "Karatsuba algorithm (threaded) took me " << t << " cycles (" << static_cast<float>(t) / CLOCKS_PER_SEC << " seconds)\n";
}

int main(int argc, char *argv[]){
    //  solve("tests/3.in");
    solve(argv[1]);
}