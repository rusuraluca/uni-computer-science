//
// Created by Raluca on 17.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_FILTERINGTYPE_H
#define LABORATORY8_RUSURALUCA_FILTERINGTYPE_H

#include "FilteringCriteria.h"

class FilteringType:public FilteringCriteria{
private:
    offer_type type;

public:
    FilteringType();
    FilteringType(offer_type);
    DynamicArray<Offer> filter(DynamicArray<Offer>&) override;
};
#endif //LABORATORY8_RUSURALUCA_FILTERINGTYPE_H