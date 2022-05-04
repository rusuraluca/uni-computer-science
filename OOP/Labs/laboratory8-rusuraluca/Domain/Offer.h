//
// Created by Raluca on 12.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_OFFER_H
#define LABORATORY8_RUSURALUCA_OFFER_H

#include "Date.h"
#include <iostream>
#include <string>
#include <sstream>

enum offer_type { none, circuit, cityBreak, cruise, allInclusive };
const std::string name_offer_type[] = { "None", "Circuit", "CityBreak", "Cruise", "All-Inclusive"};

class Offer{
private:
    std::string id;
    std::string departure;
    std::string destination;
    double price;
    Date start;
    Date end;
    offer_type type;

public:
    Offer();
    Offer(char, std::string, std::string, double, Date, Date, offer_type);
    Offer(Offer &other);

    std::string to_string() const;

    double getPrice() const;
    offer_type getType() const;
    std::string getDeparture() const;

    bool operator<(const Offer&) const;
    bool operator==(const Offer&) const;

    friend std::istream &operator>>(std::istream&, Offer&);
    friend std::ostream &operator<<(std::ostream&, const Offer&);
};

#endif //LABORATORY8_RUSURALUCA_OFFER_H