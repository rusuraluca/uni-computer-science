#include <iostream>
#include "Persistency/RepoTaxi.h"

int main() {
    RepoTaxi r;
    auto rez = r.get_all();
    for(auto taxi: rez)
        std::cout << taxi;
    return 0;
}
