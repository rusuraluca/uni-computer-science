//
// Created by Raluca on 28.03.2022.
//
#include "Rectangle.h"

// Default Constructor
Rectangle::Rectangle(){
    this->width= 0;
    this->height= 0;
    this->cornerX= 0;
    this->cornerY= 0;
}

Rectangle::Rectangle(unsigned long _width, unsigned long _height, unsigned long _cornerX, unsigned long _cornerY){
    this->width= _width;
    this->height= _height;
    this->cornerX= _cornerX;
    this->cornerY= _cornerY;
}

// Copy constructor
Rectangle::Rectangle(const Rectangle &rectangle) {
    this->width = rectangle.width;
    this->height = rectangle.height;
    this->cornerX = rectangle.cornerX;
    this->cornerY = rectangle.cornerY;
}

Rectangle::Rectangle(const Size &_size, const Point &_corner) {
    this->width = _size.getWidth();
    this->height = _size.getHeight();
    this->cornerX = _corner.getX();
    this->cornerY = _corner.getY();
}

Rectangle::Rectangle(const Point &topLeft, const Point &bottomRight) {
    if (topLeft.getX() > bottomRight.getX() ||
        topLeft.getY() > bottomRight.getY()) {
        throw std::invalid_argument("Invalid rectangle");
    }
    this->width = bottomRight.getX() - topLeft.getX();
    this->height = bottomRight.getY() - topLeft.getY();
    this->cornerX = topLeft.getX();
    this->cornerY = topLeft.getY();
}

// Copy assignment operator
Rectangle &Rectangle::operator=(const Rectangle &rectangle) {
    this->width = rectangle.width;
    this->height = rectangle.height;
    this->cornerX = rectangle.cornerX;
    this->cornerY = rectangle.cornerY;
    return *this;
}

// Getters
unsigned long Rectangle::getWidth() const {
    return this->width;
}

unsigned long Rectangle::getHeight() const {
    return this->height;
}

unsigned long Rectangle::getCornerX() const {
    return this->cornerX;
}

unsigned long Rectangle::getCornerY() const {
    return this->cornerY;
}

Size Rectangle::getSize() const {
    return {this->width, this->height};
}

Point Rectangle::getCorner() const {
    return {this->cornerX, this->cornerY};
}

Point Rectangle::getTopLeft() const {
    return {this->cornerX, this->cornerY};
}

Point Rectangle::getBottomRight() const {
    return {this->cornerX + this->width - 1, this->cornerY + this->height - 1};
}

// Setters
void Rectangle::setWidth(unsigned long _width) {
    this->width = _width;
}

void Rectangle::setHeight(unsigned long _height) {
    this->height = _height;
}

void Rectangle::setCornerX(unsigned long _cornerX) {
    this->cornerX = _cornerX;
}

void Rectangle::setCornerY(unsigned long _cornerY) {
    this->cornerY = _cornerY;
}

void Rectangle::setSize(const Size &_size) {
    this->width = _size.getWidth();
    this->height = _size.getHeight();
}

void Rectangle::setCorner(const Point &_corner) {
    this->cornerX = _corner.getX();
    this->cornerY = _corner.getY();
}

// I/O stream operators
std::istream& operator>>(std::istream& is, Rectangle& r){
    is >> r.width >> r.height >> r.cornerX >> r.cornerY;
    return is;
}

std::ostream& operator<<(std::ostream& os, const Rectangle& r){
    std::ostringstream ss;
    ss << "Width: " << r.getWidth() << "\nHeight: " << r.getHeight() << "\nCorner X: " << r.getCornerX() << "\nCorner Y: " << r.getCornerY();
    os << ss.str();
    return os;
}

// Arithmetic operators
Rectangle &Rectangle::operator+(Vector &translation) {
    long newCornerX = this->cornerX + translation.getX();
    newCornerX > 0 ? this->cornerX = newCornerX : this->cornerX = 0;
    long newCornerY = this->cornerY + translation.getY();
    newCornerY > 0 ? this->cornerY = newCornerY : this->cornerY = 0;
    return *this;
}

Rectangle &Rectangle::operator-(Vector &translation) {
    long newCornerX = this->cornerX - translation.getX();
    newCornerX > 0 ? this->cornerX = newCornerX : this->cornerX = 0;
    long newCornerY = this->cornerY - translation.getY();
    newCornerY > 0 ? this->cornerY = newCornerY : this->cornerY = 0;
    return *this;
}

Rectangle &Rectangle::operator&(const Rectangle &other) const{
    if (this->cornerX > other.cornerX + other.width ||
        this->cornerY > other.cornerY + other.height ||
        this->cornerX + this->width < other.cornerX ||
        this->cornerY + this->height < other.cornerY) {
        throw std::invalid_argument("Rectangles do not intersect.");
    }
    auto intersectionWidth =
            std::min(std::min(this->width, other.width + other.cornerX - this->cornerX),
                this->width + this->cornerX - other.cornerX);
    auto intersectionHeight =
            std::min(std::min(this->height, other.height + other.cornerY - this->cornerY),
                this->height + this->cornerY - other.cornerY);
    unsigned newCornerX = std::max(this->cornerX, other.cornerX);
    unsigned newCornerY = std::max(this->cornerY, other.cornerY);
    static Rectangle temp(intersectionWidth, intersectionHeight, newCornerX, newCornerY);
    return temp;
}

Rectangle &Rectangle::operator|(const Rectangle &other) const{
    unsigned newCornerX =
            std::min(this->getTopLeft().getX(), other.getTopLeft().getX());
    unsigned newCornerY =
            std::min(this->getTopLeft().getY(), other.getTopLeft().getY());
    unsigned long rightmostX =
            std::max(this->getBottomRight().getX(), other.getBottomRight().getX());
    unsigned long bottommostY =
            std::max(this->getBottomRight().getY(), other.getBottomRight().getY());
    static Rectangle temp(rightmostX - newCornerX + 1, bottommostY - newCornerY + 1, newCornerX, newCornerY);
    return temp;
}
