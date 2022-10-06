# include "FilteringCriteriaTypeAndPrice.h"

FilteringCriteriaTypeAndPrice::FilteringCriteriaTypeAndPrice(){
    this->p = FilteringPrice();
    this->t = FilteringType();

}
FilteringCriteriaTypeAndPrice::FilteringCriteriaTypeAndPrice(FilteringPrice _p, FilteringType _t){
    this->p = FilteringPrice(_p);
    this->t = FilteringType(_t);
}
DynamicArray FilteringCriteriaTypeAndPrice::filter(DynamicArray& data){
    DynamicArray filteredArr = this->p.filter(data);
    DynamicArray filteredArr2 = this->t.filter(filteredArr);
    return filteredArr2;
}