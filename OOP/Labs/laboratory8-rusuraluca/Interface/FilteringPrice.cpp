#include "FilteringPrice.h"

FilteringPrice::FilteringPrice(){
    this->price = 0;
}

FilteringPrice::FilteringPrice(double _price){
    this->price = _price;
}

DynamicArray<Offer> FilteringPrice::filter(DynamicArray<Offer>& data){
    DynamicArray<Offer> filteredArr;
    for(int i = 0; i < data.getLength(); ++i){
        if(data.get(i).getPrice() < this->price){
            filteredArr.append(data.get(i));
        }
    }
    return filteredArr;
}