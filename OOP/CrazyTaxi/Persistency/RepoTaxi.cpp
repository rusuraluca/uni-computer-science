//
// Created by Raluca on 31.05.2022.
//
#include "RepoTaxi.h"

void RepoTaxi::add(const Taxi& taxi){
    read_all_from_file();
    repo.push_back(taxi);
    write_all_to_file();
}

const std::vector<Taxi>& RepoTaxi::get_all(){
    read_all_from_file();
    return this->repo;
}

void RepoTaxi::read_all_from_file(){
    std::ifstream ifs("file.csv");
    this->repo.clear();

    if (!ifs.is_open())
        throw ("File can't be opened!");

    Taxi r;
    while(ifs >> r){
        this->repo.push_back(r);
    }

    ifs.close();
}

void RepoTaxi::write_all_to_file(){
    std::ofstream ofs{"new_file.csv"};

    std::for_each(this->repo.begin(),this->repo.end(),[&](const auto& x){
        ofs << x;
    });

    ofs.close();
}