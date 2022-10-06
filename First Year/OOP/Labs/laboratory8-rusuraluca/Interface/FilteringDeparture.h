//
// Created by Raluca on 17.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_FILTERINGDEPARTURE_H
#define LABORATORY8_RUSURALUCA_FILTERINGDEPARTURE_H

#include "FilteringCriteria.h"

class FilteringDeparture:public FilteringCriteria{
private:
    std::string departure;

public:
    FilteringDeparture();
    FilteringDeparture(std::string);
    DynamicArray<Offer> filter(DynamicArray<Offer>&) override;
};

#endif //LABORATORY8_RUSURALUCA_FILTERINGDEPARTURE_H
