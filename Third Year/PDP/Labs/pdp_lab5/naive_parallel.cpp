#include <iostream>
#include <fstream>
#include <vector>
#include <ctime>
#include <thread>

using namespace std;

const int T = 3;

int n;
vector<int> a, b, sol;
vector<thread> threads;

void work(int idx){
    for (int i = idx; i < n; i += T){
        // solve for position i
        for (int x = 0; x <= i; ++x){
            int y = i - x;
            sol[i] += a[x] * b[y];
        }
    }
}

void solve(string filename){
    clock_t t;
    t = clock();

    ifstream fin(filename);
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

    sol.resize(2 * n - 1, 0);

    for (int i = 0; i < min(n, T); ++i){
        threads.push_back(thread(work, i));
    }
    for (int i = 0; i < threads.size(); ++i){
        threads[i].join();
    }

    t = clock() - t;
    cout << "Naive algorithm (threaded) took me " << t << " cycles ("<< static_cast<float>(t) / CLOCKS_PER_SEC << " seconds)\n";
}

int main(int argc, char *argv[]){
    //solve("input.in");
    solve(argv[1]);
}