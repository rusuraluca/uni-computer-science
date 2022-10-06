//
// Created by Raluca on 31.05.2022.
//
#include "Service.h"

void Service::simulate_one_step(int width, int height){
    auto rez = this->repo.get_all();
    for(auto taxi : rez){
        taxi.setLat(taxi.getLat() + taxi.getVlat());
        taxi.setLon(taxi.getLon() + taxi.getVlong());
        taxi.setVlong(random() % 11 - 5);
        taxi.setVlat(random() % 11 - 5);
        if(taxi.getLat() < 0 || taxi.getLat() > width){
            taxi.setVlat(-taxi.getVlat());
        }
        if(taxi.getLon() < 0 || taxi.getLon() > height){
            taxi.setVlong(-taxi.getVlong());
        }
    }
}

const std::vector<Taxi>& Service::get_all(){
    return this->repo.get_all();
}
