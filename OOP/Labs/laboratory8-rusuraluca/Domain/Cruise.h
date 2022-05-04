//
// Created by Raluca on 17.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_CRUISE_H
#define LABORATORY8_RUSURALUCA_CRUISE_H
#include "Offer.h"
#include "../Repo/DynamicArray.h"

class Cruise: public Offer{
private:
    DynamicArray<std::string> stops;
public:
    Cruise();

    Cruise(char, std::string, std::string, double, Date, Date, offer_type, DynamicArray<std::string>);

    std::string to_string() const;

    friend std::ostream &operator<<(std::ostream&, const Cruise&);
};


#endif //LABORATORY8_RUSURALUCA_CRUISE_H
