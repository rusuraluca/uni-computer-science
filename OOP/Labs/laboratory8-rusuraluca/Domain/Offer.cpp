#include "Offer.h"

Offer::Offer(){
    this->id = '0';
    this->departure = "none";
    this->destination = "none";
    this->price = 0.0;
    this->start = Date();
    this->end = Date();
    this->type = none;

}

Offer::Offer(char _id, std::string _departure, std::string _destination, double _price, Date _start, Date _end, offer_type _type){
    this->id = _id;
    this->departure = _departure;
    this->destination = _destination;
    this->price = _price;
    this->start = _start;
    this->end = _end;
    this->type = _type;
}

Offer::Offer(Offer &other){
    this->id = other.id;
    this->departure = other.departure;
    this->destination = other.destination;
    this->price = other.price;
    this->start = other.start;
    this->end = other.end;
    this->type = other.type;
}

double Offer::getPrice() const{
    return this->price;
}

offer_type Offer::getType() const{
    return this->type;
}

std::string Offer::getDeparture() const{
    return this->departure;
}

// Istream operator
std::istream &operator>>(std::istream &stream, Offer &o) {
    int _type;
    stream >> o.id >> o.departure >> o.destination >> o.price >> o.start >> _type;
    o.type = static_cast<offer_type>(_type);
    return stream;
}

// Ostream operator
std::ostream &operator<<(std::ostream &stream, const Offer &o) {
    stream << o.to_string();
    return stream;
}

// Converts an Offer to a string
std::string Offer::to_string() const {
    std::ostringstream str;
    if (this->price == 0){
        return "No offer";
    } else {
        str << "\n" << "Id: " << this->id << "\n"
        << "Departure: " << this->departure << "\n"
        << "Destination: " << this->destination << "\n"
        << "Price: " << this->price << "\n"
        << "Start Date: " << (this->start).date_to_string() << "\n"
        << "End Date: " << (this->end).date_to_string() << "\n"
        << "Type: " << name_offer_type[(int)this->type] << "\n";
    }
    return str.str();
}

bool Offer::operator<(const Offer &_offer) const {
    return this->id<_offer.id;
}

bool Offer::operator==(const Offer &_offer) const {
    return this->id==_offer.id;
}
