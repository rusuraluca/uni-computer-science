//
// Created by Raluca on 31.05.2022.
//

#ifndef CRAZYTAXICLASSES_SERVICE_H
#define CRAZYTAXICLASSES_SERVICE_H

#include "../Persistency/RepoTaxi.h"

class Service{
private:
    RepoTaxi& repo;

public:
    void simulate_one_step(int, int);
};
#endif //CRAZYTAXICLASSES_SERVICE_H
