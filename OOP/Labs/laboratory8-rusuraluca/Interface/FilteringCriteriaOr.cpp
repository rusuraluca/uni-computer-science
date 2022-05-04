//
// Created by Raluca on 17.04.2022.
//
#include "FilteringCriteriaOr.h"

FilteringCriteriaOr::FilteringCriteriaOr(){
    this->crt1 = nullptr;
    this->crt2 = nullptr;
};

void FilteringCriteriaOr::setC1(FilteringCriteria* _crt1){
    this->crt1 = _crt1;
}
void FilteringCriteriaOr::setC2(FilteringCriteria* _crt2){
    this->crt2 = _crt2;
}

DynamicArray<Offer> FilteringCriteriaOr::filter(DynamicArray<Offer> &arr){
    DynamicArray<Offer> f1 = this->crt1->filter(arr);
    DynamicArray<Offer> f2 = this->crt2->filter(arr);
    DynamicArray<Offer> merged(f1.getLength() + f2.getLength());

    int l1 = 0, l2 = 0;

    while(l1 < f1.getLength() && l2 < f2.getLength()){
        if(f1.get(l1) < f2.get(l2)){
            merged.append(f1.get(l1));
            l1++;
        }else if(f1.get(l1) == f2.get(l2)){
            merged.append(f1.get(l1));
            l1++;
            l2++;
        }
        else{
            merged.append(f2.get(l2));
            l2++;
        }
    }

    while(l1 < f1.getLength()){
        merged.append(f1.get(l1));
        l1++;
    }

    while(l2 < f2.getLength()){
        merged.append(f2.get(l2));
        l2++;
    }

    return merged;
}