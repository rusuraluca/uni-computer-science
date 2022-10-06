//
// Created by Raluca on 12.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_FILTERINGCRITERIA_H
#define LABORATORY8_RUSURALUCA_FILTERINGCRITERIA_H

#include "../Repo/DynamicArray.h"

class FilteringCriteria{
public:
    virtual DynamicArray<Offer> filter(DynamicArray<Offer>&) = 0;
};

#endif //LABORATORY8_RUSURALUCA_FILTERINGCRITERIA_H
