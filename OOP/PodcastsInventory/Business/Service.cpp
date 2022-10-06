//
// Created by Raluca on 10.05.2022.
//
#include "Service.h"
#include <iterator>

vector<Recording> Service::getRecordingsSortedByTitle() {
    vector<Recording> rez= repo.getAll();
    std::sort(rez.begin(),rez.end(),[](const auto& x,const auto& y){
        return x.getTitle()<y.getTitle();
    });
    return rez;
}
