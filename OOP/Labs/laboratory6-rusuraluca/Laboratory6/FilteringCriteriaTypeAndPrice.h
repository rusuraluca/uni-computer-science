#pragma once

#include "FilteringPrice.h"
#include "FilteringType.h"

class FilteringCriteriaTypeAndPrice:public FilteringCriteria{
private:
    FilteringPrice p;
    FilteringType t;

public:
    FilteringCriteriaTypeAndPrice();
    FilteringCriteriaTypeAndPrice(FilteringPrice, FilteringType);
    DynamicArray filter(DynamicArray&) override;
};