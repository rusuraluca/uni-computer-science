//
// Created by Raluca on 28.03.2022.
//
#include "Point.h"

// Default Constructor
Point::Point(){
    this->x = 0;
    this->y = 0;
}

Point::Point(unsigned long _x, unsigned long _y){
    this->x = _x;
    this->y = _y;
}

// Copy constructor
Point::Point(const Point &other) {
    this->x = other.x;
    this->y = other.y;
}

// Copy assignment operator
Point &Point::operator=(const Point &other) {
    this->x = other.x;
    this->y = other.y;
    return *this;
}

// Getters
unsigned long Point::getX() const{
    return this->x;
}

unsigned long Point::getY() const{
    return this->y;
}

// Setters
void Point::setX(unsigned long _x) {
    this->x = _x;
}

void Point::setY(unsigned long _y) {
    this->y = _y;
}

// I/O stream operators
std::istream& operator>>(std::istream &is, Point &p){
    is >> p.x >> p.y;
    return is;
}

std::ostream& operator<<(std::ostream &os, const Point &p){
    std::ostringstream ss;
    ss << "(" << p.getX() << "," << p.getY() << ")";
    os << ss.str();
    return os;
}

// Relational operators
bool operator==(const Point &p1, const Point &p2){
    return (p1.x == p2.x && p1.y == p2.y);
}