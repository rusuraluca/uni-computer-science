//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_POINT_H
#define IMAGE_PROCESSING_POINT_H

#include <iosfwd>
#include <sstream>

// Class to represent a Point ((x, y) coordinates of a point)
class Point {
public:
    friend class Image;
    friend class Draw;

    // Default Constructor
    Point();

    Point(unsigned long, unsigned long);

    // Copy constructor
    Point(const Point&);

    // Copy assignment operator
    Point &operator=(const Point&);

    // Getters
    unsigned long getX() const;
    unsigned long getY() const;

    // Setters
    void setX(unsigned long);
    void setY(unsigned long);

    // I/O stream operators
    friend std::istream& operator>>(std::istream&, Point&);
    friend std::ostream& operator<<(std::ostream&, const Point&);

    // Relational operators
    friend bool operator==(const Point&, const Point&);

private:
    // Attributes
    unsigned long x;
    unsigned long y;
};

#endif //IMAGE_PROCESSING_POINT_H