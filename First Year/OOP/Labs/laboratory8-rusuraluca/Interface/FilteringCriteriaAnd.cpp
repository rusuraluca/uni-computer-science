//
// Created by Raluca on 12.04.2022.
//

#include "FilteringCriteriaAnd.h"

FilteringCriteriaAnd::FilteringCriteriaAnd(){
    this->crt1 = nullptr;
    this->crt2 = nullptr;
};

void FilteringCriteriaAnd::setC1(FilteringCriteria* _crt1){
    this->crt1 = _crt1;
}
void FilteringCriteriaAnd::setC2(FilteringCriteria* _crt2){
    this->crt2 = _crt2;
}

DynamicArray<Offer> FilteringCriteriaAnd::filter(DynamicArray<Offer> &arr){
    DynamicArray<Offer> f1 = this->crt1->filter(arr);
    return this->crt2->filter(f1);
}