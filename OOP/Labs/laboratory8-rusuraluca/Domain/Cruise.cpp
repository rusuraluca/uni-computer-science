//
// Created by Raluca on 17.04.2022.
//
#include "Cruise.h"

Cruise::Cruise(){
    Offer();
    this->stops = none;
}

Cruise::Cruise(char _id, std::string _departure, std::string _destination, double _price, Date _start, Date _end, offer_type _type, DynamicArray<std::string> _stops){
    Offer(_id, _departure, _destination, _price, _start, _end, _type);
    this->stops = _stops;
}
