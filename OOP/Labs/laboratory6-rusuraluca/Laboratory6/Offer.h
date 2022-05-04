#pragma once

#include "Date.h"
#include <iostream>

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

    friend std::istream &operator>>(std::istream&, Offer&);
    friend std::ostream &operator<<(std::ostream&, const Offer&);
};

