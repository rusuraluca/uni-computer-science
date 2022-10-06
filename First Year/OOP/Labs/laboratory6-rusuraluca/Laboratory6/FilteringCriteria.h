#pragma once

#include "DynamicArray.h"

class FilteringCriteria{
public:
    virtual DynamicArray filter(DynamicArray&);
};

