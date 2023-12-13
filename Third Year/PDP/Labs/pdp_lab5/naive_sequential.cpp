#include <iostream>
#include <fstream>
#include <vector>
#include <ctime>

using namespace std;

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

    vector<int> sol(2 * n - 1, 0);

    for (int i = 0; i < n; ++i){
        for (int j = 0; j < n; ++j){
            sol[i + j] += a[i] * b[j];
        }
    }

    t = clock() - t;
    cout << "Naive algorithm took me " << t << " cycles (" << static_cast<float>(t) / CLOCKS_PER_SEC << " seconds)\n";
}

int main(int argc, char *argv[]){
    //  solve("input.in");
    solve(argv[1]);
}