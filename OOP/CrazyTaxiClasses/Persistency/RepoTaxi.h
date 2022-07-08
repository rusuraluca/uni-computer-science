//
// Created by Raluca on 31.05.2022.
//

#ifndef CRAZYTAXICLASSES_REPOTAXI_H
#define CRAZYTAXICLASSES_REPOTAXI_H

#include "../Domain/Taxi.h"
#include <vector>
#include <fstream>

class RepoTaxi{
private:
    std::vector<Taxi> repo;
    void read_all_from_file();
    void write_all_to_file();

public:
    RepoTaxi(){};
    void add(const Taxi& taxi);
    const std::vector<Taxi>& get_all();
};

#endif //CRAZYTAXICLASSES_REPOTAXI_H
