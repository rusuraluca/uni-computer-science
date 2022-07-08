//
// Created by Raluca on 31.05.2022.
//
#include "Taxi.h"

Taxi::Taxi():
        id{0}, nume{""}, lat{0}, lon{0}, vlat{0}, vlong{0}
{}

Taxi::Taxi(int _id, std::string _nume, int _lat, int _lon, int _vlat, int _vlong):
    id{_id}, nume{_nume}, lat{_lat}, lon{_lon}, vlat{_vlat}, vlong{_vlong}
{}

Taxi::Taxi(const Taxi& other):
    id{other.id}, nume{other.nume}, lat{other.lat}, lon{other.lon}, vlat{other.vlat}, vlong{other.vlong}
{}

int Taxi::getId() const{
    return this->id;
}

void Taxi::setId(int _id){
    this->id = _id;
}

std::string Taxi::getNume() const{
    return this->nume;
}

void Taxi::setNume(std::string _nume){
    this->nume = _nume;
}

int Taxi::getLat() const{
    return this->lat;
}
void Taxi::setLat(int _lat){
    this->lat = _lat;
}

int Taxi::getLon() const{
    return this->lon;
}

void Taxi::setLon(int _lon){
    this->lon = _lon;
}

int Taxi::getVlat() const{
    return this->vlat;
}

void Taxi::setVlat(int _vlat){
    this->vlat = _vlat;
}

int Taxi::getVlong()const{
    return this->vlong;
}

void Taxi::setVlong(int _vlong){
    this->vlong = _vlong;
}

std::vector<std::string> tokenize(std::string str, char delimiter){
    std::vector<std::string> result;
    std::stringstream ss(str);
    std::string token;
    while (getline(ss, token, delimiter))
        result.push_back(token);

    return result;
}

std::istream& operator>>(std::istream& is, Taxi& taxi) {
    std::string line;
    getline(is, line);

    std::vector<std::string> tokens = tokenize(line, ',');
    if (tokens.size() != 6) // make sure the data we have is ok
        return is;

    int id;
    std::istringstream(tokens[0]) >> id;
    taxi.id = id;

    taxi.nume = tokens[1];

    int lat, lon, vlat, vlong;
    std::istringstream(tokens[2]) >> lat;
    taxi.lat = lat;

    std::istringstream(tokens[3]) >> lon;
    taxi.lon = lon;

    std::istringstream(tokens[4]) >> vlat;
    taxi.vlat = vlat;

    std::istringstream(tokens[5]) >> vlong;
    taxi.vlong = vlong;

    return is;
}

std::ostream &operator<<(std::ostream &os, const Taxi &taxi) {
    os << taxi.getId() << "," << taxi.getNume() << "," << taxi.getLat() << "," << taxi.getLon() << "," << taxi.getVlat() << "," << taxi.getVlong() << std::endl;
    return os;
}