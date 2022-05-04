#include "Date.h"
#include <iostream>
#include <string>
#include <sstream>


Date::Date(){
    this->day = 0;
    this->month = 0;
    this->year = 0;
 }

Date::Date(unsigned int _day, unsigned int _month, unsigned int _year){
    this->day = _day;
    this->month = _month;
    this->year = _year;
}

// Istream operator
std::istream &operator>>(std::istream &stream, Date &d) {
    stream >> d.day >> d.month >> d.year;
    return stream;
}

// Ostream operator
std::ostream &operator<<(std::ostream &stream, const Date &d) {
    stream << d.date_to_string();
    return stream;
}

// Converts an Offer to a string
std::string Date::date_to_string() const {
    std::ostringstream str;
    str << this->day << "/" << this->month << "/" << this->year;
    return str.str();
}
