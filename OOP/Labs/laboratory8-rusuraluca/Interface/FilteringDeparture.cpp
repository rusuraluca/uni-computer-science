//
// Created by Raluca on 17.04.2022.
//
#include "FilteringDeparture.h"

FilteringDeparture::FilteringDeparture(){
    this->departure = none;
}

FilteringDeparture::FilteringDeparture(std::string _departure){
    this->departure = _departure;
}

DynamicArray<Offer> FilteringDeparture::filter(DynamicArray<Offer>& data){
    DynamicArray<Offer> filteredArr;
    for(int i = 0; i < data.getLength(); ++i){
        if(data.get(i).getDeparture() == this->departure){
            filteredArr.append(data.get(i));
        }
    }
    return filteredArr;
}
