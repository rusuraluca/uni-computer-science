//
// Created by Raluca on 31.05.2022.
//

#ifndef CRAZYTAXICLASSES_TAXI_H
#define CRAZYTAXICLASSES_TAXI_H

#include <string>
#include <vector>
#include <sstream>

class Taxi{
private:
    int id;
    std::string nume;
    int lat, lon, vlat, vlong;

public:
    Taxi();
    Taxi(int _id, std::string _nume, int _lat, int _lon, int _vlat, int _vlong);
    Taxi(const Taxi&);

    int getId() const;
    void setId(int);
    std::string getNume() const;
    void setNume(std::string);
    int getLat() const;
    void setLat(int);
    int getLon() const;
    void setLon(int);
    int getVlat() const;
    void setVlat(int);
    int getVlong() const;
    void setVlong(int);

    friend std::istream& operator>>(std::istream& is, Taxi& taxi);
    friend std::ostream& operator<<(std::ostream& os, const Taxi& taxi);
};

#endif //CRAZYTAXICLASSES_TAXI_H
