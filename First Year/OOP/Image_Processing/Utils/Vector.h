//
// Created by Raluca on 30.03.2022.
//

#ifndef IMAGE_PROCESSING_VECTOR_H
#define IMAGE_PROCESSING_VECTOR_H

// Class to represent a 2D Vector ((x, y) coordinates of a point)
class Vector{
public:
    // Default Constructor
    Vector();

    Vector(double, double);

    // Copy constructor
    Vector(const Vector&);

    // Copy assignment operator
    Vector &operator=(const Vector&);

    // Getters
    double getX() const;
    double getY() const;

    // Setters
    void setX(double x);
    void setY(double y);

private:
    // Attributes
    double x;
    double y;
};

#endif //IMAGE_PROCESSING_VECTOR_H
