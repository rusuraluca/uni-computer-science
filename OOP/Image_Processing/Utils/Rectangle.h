//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_RECTANGLE_H
#define IMAGE_PROCESSING_RECTANGLE_H

#include "Point.h"
#include "Size.h"
#include "Vector.h"
#include <iostream>
#include <cmath>

// Class to represent a Rectangle (x and y coordinates of the top-left point, the width and height of the rectangle)
class Rectangle {
public:
    friend class Image;

    // Default Constructor
    Rectangle();

    Rectangle(unsigned long, unsigned long, unsigned long, unsigned long);

    // Copy constructor
    Rectangle(const Rectangle&);

    Rectangle(const Size&, const Point&);

    Rectangle(const Point&, const Point&);

    // Copy assignment operator
    Rectangle &operator=(const Rectangle&);

    // Getters
    unsigned long getWidth() const;
    unsigned long getHeight() const;
    unsigned long getCornerX() const;
    unsigned long getCornerY() const;
    Size getSize() const;
    Point getCorner() const;
    Point getTopLeft() const;
    Point getBottomRight() const;

    // Setters
    void setWidth(unsigned long width);
    void setHeight(unsigned long height);
    void setCornerX(unsigned long cornerX);
    void setCornerY(unsigned long cornerY);
    void setSize(const Size&);
    void setCorner(const Point&);

    // I/O stream operators
    friend std::istream& operator>>(std::istream&, Rectangle&);
    friend std::ostream& operator<<(std::ostream&, const Rectangle&);

    // Arithmetic operators
    Rectangle &operator+(Vector&);
    Rectangle &operator-(Vector&);
    Rectangle &operator&(const Rectangle&) const;
    Rectangle &operator|(const Rectangle&) const;

private:
    // Attributes
    unsigned long width;
    unsigned long height;
    unsigned long cornerX;
    unsigned long cornerY;
};

#endif //IMAGE_PROCESSING_RECTANGLE_H