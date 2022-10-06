//
// Created by Raluca on 08.05.2022.
//
#include "Vlog.h"

Vlog::Vlog(): Recording(), quality{0}{}

Vlog::Vlog(int _id, const string& _title, const string& _author, double _length, const string& _type, int _quality):
    Recording(_id,_title, _author, _length, _type), quality{_quality}{}

Vlog::Vlog(const Vlog& other): Recording(other), quality{other.quality} {}

void Vlog::display(ostream& os) const{
    Recording::display(os);
    os << "," << quality;
}

int Vlog::getQuality() const{
    return this->quality;
}
void Vlog::setQuality(int _quality){
    this->quality= _quality;
}

std::istream& operator>>(std::istream& is, Vlog& vlog) {
    std::string line;
    getline(is, line);

    std::vector<std::string> tokens = Recording::tokenize(line, ',');
    if (tokens.size() != 6) // make sure the data we have is ok
        return is;

    int id;
    std::istringstream(tokens[0]) >> id;
    vlog.setId(id);

    vlog.setTitle(tokens[1]);
    vlog.setAuthor(tokens[2]);

    double length;
    std::istringstream(tokens[3]) >> length;
    vlog.setLength(length);

    vlog.setType(tokens[4]);

    int quality;
    std::istringstream(tokens[5]) >> quality;
    vlog.setQuality(quality);

    return is;
}

ostream &operator<<(ostream& os, const Vlog& vlog) {
    vlog.display(os);
    return os;
}

Vlog::~Vlog(){}

void ValidatorVlog::validateVlog(const Vlog& vlog){
    string errorMsg = "";
    ValidatorRecording::validateRecording(vlog);
    if (vlog.quality < 144 || vlog.quality > 2160)
        errorMsg += "Incorrect maximum speed: chose between 144 and 2160!\n";
    if (errorMsg.size() > 0)
        throw ValidationException{ errorMsg };
}