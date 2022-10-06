//
// Created by Raluca on 10.05.2022.
//
#pragma once

#include "../Domain/Recording.h"
#include "../Persistency/Repo.h"
#include <vector>
using std::vector;

class Service {
private:
    Repo<Recording>& repo;

public:
    vector<Recording> getRecordingsSortedByTitle();
};

