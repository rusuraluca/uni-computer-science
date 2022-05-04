//
// Created by Raluca on 30.03.2022.
//
#include "Vector.h"

// Default Constructor
Vector::Vector() : x(0), y(0) {}

Vector::Vector(double _x, double _y) : x(_x), y(_y) {}

// Copy constructor
Vector::Vector(const Vector &other) {
    this->x = other.x;
    this->y = other.y;
}

// Copy assignment operator
Vector &Vector::operator=(const Vector &other) {
    this->x = other.x;
    this->y = other.y;
    return *this;
}

// Getters
double Vector::getX() const {
    return this->x;
}

double Vector::getY() const {
    return this->y;
}

// Setters
void Vector::setX(double _x) {
    this->x = _x;
}

void Vector::setY(double _y) {
    this->y = _y;
}

