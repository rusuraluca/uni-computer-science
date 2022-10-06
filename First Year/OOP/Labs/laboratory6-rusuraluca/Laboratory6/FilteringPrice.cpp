#include "FilteringPrice.h"

FilteringPrice::FilteringPrice(){
    this->price = 0;
}

FilteringPrice::FilteringPrice(double _price){
    this->price = _price;
}

DynamicArray FilteringPrice::filter(DynamicArray& data){
    DynamicArray filteredArr;
    for(int i = 0; i < data.getLength(); ++i){
        if(data.get(i).getPrice() < this->price){
            filteredArr.append(data.get(i));
        }
    }
    return filteredArr;
}