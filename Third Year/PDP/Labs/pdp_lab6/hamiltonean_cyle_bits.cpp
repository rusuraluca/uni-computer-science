#include <iostream>
#include <fstream>
#include <vector>
#include <thread>

using namespace std;

const int max_n = 65;
const int NO_THREADS = 4000;
int n, m;
vector<int> g[max_n];
int T = 0;
mutex mtx;

inline void read_graph(string filename) {
    ifstream fin(filename);
    fin >> n >> m;
    int x, y;
    for(int i = 0; i < m; ++i) {
        fin >> x >> y;
        g[x].push_back(y);
    }
    fin.close();
}

inline void write_cycle(const char *filename, vector<int> &sol) {
    for(int i = 0; i < n; ++i) {
        cerr << sol[i] << ' ';
    }
    cerr << sol[0] << '\n';
}

inline bool is_edge(const int x, const int y) {
    for(int i = 0; i < g[x].size(); ++i) {
        if(g[x][i] == y) {
            return true;
        }
    }
    return false;
}

inline bool find_cycle_bitwise(int node, vector<int> &sol, long long x) {
    sol.push_back(node);
    x |= (1 << node); // mark node as visited
    if(sol.size() == n) {
        return is_edge(sol.back(), sol[0]);
    }
    vector<int> a(sol), b(sol);

    bool sol1 =0;
    mtx.lock();
    if(T < NO_THREADS) {
        T += 2;
        mtx.unlock();
        thread t1([&](){
            for(int i = 0; i < g[node].size(); i += 2) {
                vector<int> aux(a);
                if (x & (1 << g[node][i])) // skip already visited nodes
                    continue;
                if(find_cycle_bitwise(g[node][i], aux, x)) {
                    sol1 = 1;
                    a = aux;
                    return;
                }
            }
        });
        bool sol2 = 0;
        thread t2([&](){
            for(int i = 0; i < g[node].size(); i += 2) {
                vector<int> bux(b);
                if (x & (1 << g[node][i])) // skip already visited nodes
                    continue;
                if(find_cycle_bitwise(g[node][i], bux, x)) {
                    sol2 = 1;
                    b = bux;
                    return;
                }
            }
        });
        t1.join();
        t2.join();
        mtx.lock();
        T -= 2;
        mtx.unlock();
        if (sol1) {
            sol = a;
            return 1;
        } else if (sol2) {
            sol = b;
            return 1;
        }
    } else {
        mtx.unlock();
        for(int i = 0; i < g[node].size(); ++i) {
            vector<int> aux(a);
            if (x & (1 << g[node][i]))
                continue;
            if(find_cycle_bitwise(g[node][i], aux, x)) {
                sol = aux;
                return 1;
            }
        }
    }
    return 0;
}

int main(int argc, char *argv[]) {
    read_graph(argv[1]);
    cerr << "Finding a hamiltonian cycle of " << n << " nodes.\n";
    clock_t t;
    t = clock();
    vector<int> sol;
    if(find_cycle_bitwise(1, sol, 0)) {
        cerr << "Found a hamiltonian cycle using bit op in " << (float)(clock() - t)/CLOCKS_PER_SEC << " seconds.\n";
        write_cycle(argv[2], sol);
    } else {
        cerr << "No hamiltonian cycle found in " << (float)(clock() - t)/CLOCKS_PER_SEC << " seconds.\n";
    }
}