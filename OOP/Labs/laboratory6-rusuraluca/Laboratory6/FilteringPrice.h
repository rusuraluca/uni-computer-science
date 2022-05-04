#include "FilteringCriteria.h"

class FilteringPrice:public FilteringCriteria{
private:
    double price;

public:
    FilteringPrice();
    FilteringPrice(double);
    DynamicArray filter(DynamicArray&) override;
};