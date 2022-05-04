//
// Created by Raluca on 12.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_FILTERINGCRITERIAAND_H
#define LABORATORY8_RUSURALUCA_FILTERINGCRITERIAAND_H

#include "FilteringCriteria.h"

class FilteringCriteriaAnd: public FilteringCriteria {
private:
    FilteringCriteria* crt1;
    FilteringCriteria* crt2;

public:
    FilteringCriteriaAnd();

    void setC1(FilteringCriteria* _crt1);
    void setC2(FilteringCriteria* _crt2);

    DynamicArray<Offer> filter(DynamicArray<Offer>&) override;
};

#endif //LABORATORY8_RUSURALUCA_FILTERINGCRITERIAAND_H
