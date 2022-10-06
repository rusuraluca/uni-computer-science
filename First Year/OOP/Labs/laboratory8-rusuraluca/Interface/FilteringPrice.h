#include "FilteringCriteria.h"

class FilteringPrice:public FilteringCriteria{
private:
    double price;

public:
    FilteringPrice();
    FilteringPrice(double);
    DynamicArray<Offer> filter(DynamicArray<Offer>&) override;
};