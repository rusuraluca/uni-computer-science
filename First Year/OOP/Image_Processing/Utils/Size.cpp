//
// Created by Raluca on 28.03.2022.
//
#include "Size.h"

// Default Constructor
Size::Size(){
    this->width = 0;
    this->height = 0;
    this->size = 0;
}

Size::Size(unsigned long _width, unsigned long _height){
    this->width = _width;
    this->height = _height;
    this->size = this->width * this->height;
}

// Copy constructor
Size::Size(const Size &other) {
    this->width = other.width;
    this->height = other.height;
    this->size = this->width * this->height;
}

// Copy assignment operator
Size &Size::operator=(const Size &other) {
    this->width = other.width;
    this->height = other.height;
    this->size = this->width * this->height;
    return *this;
}

// Getters
unsigned long Size::getWidth() const {
    return this->width;
}

unsigned long Size::getHeight() const {
    return this->height;
}

unsigned long Size::getSize() const {
    return this->size;
}

// Setters
void Size::setWidth(unsigned long _width) {
    this->width = _width;
}

void Size::setHeight(unsigned long _height) {
    this->height = _height;
}

void Size::setSize(unsigned long _size) {
    this->size = _size;
}

// Relational operators
bool operator==(const Size &a, const Size &b){
    return a.size == b.size;
}

bool operator!=(const Size &a, const Size &b){
    return a.size != b.size;
}