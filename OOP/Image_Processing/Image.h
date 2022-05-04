//
// Created by Raluca on 28.03.2022.
//
#pragma once

#ifndef IMAGE_PROCESSING_IMAGE_H
#define IMAGE_PROCESSING_IMAGE_H

#include "Utils.h"

#include <fstream>
#include <sstream>
#include <iostream>
#include <iomanip>
#include <regex>
#include <stdexcept>
#include <string>
#include <vector>

#define valid_char(val) (unsigned char)(val <= 0 ? 0 : val >= 255 ? 255 : val)

using std::cout;
using std::endl;
using std::string;

class Image {
public:
    // Default constructor
    Image();

    Image(unsigned int, unsigned int);

    Image(const Size&);

    // Copy constructor
    Image(const Image&);

    // Destructor
    ~Image();

    // Copy assignment operator
    Image& operator=(const Image&);

    // Getters
    unsigned int getWidth() const;
    unsigned int getHeight() const;

    bool load(const std::string&);
    bool save(const std::string&);

    Size size() const;
    bool isEmpty() const;
    void release();
    void updateMax();

    unsigned char &at(unsigned int, unsigned int);
    unsigned char atConst(unsigned int, unsigned int) const;
    unsigned char &at(Point&);
    unsigned char *row(int);

    // Ostream operators
    friend std::ostream& operator<<(std::ostream&, const Image&);

    // Arithmetic operators
    Image operator+(const Image&);
    Image operator-(const Image&);
    Image operator*(const Image&);

    Image operator+(const int&);
    Image operator-(const int&);
    Image operator*(const int&);

    // Relational operators
    friend bool operator==(const Image&, const Image&);
    friend bool operator!=(const Image&, const Image&);

    static Image zeros(unsigned int, unsigned int);
    static Image ones(unsigned int, unsigned int);
    static Image max(unsigned int, unsigned int);
    static Image generateFilled(unsigned int, unsigned int, unsigned int);

    bool getROI(Image&, const Rectangle&);
    bool getROI(Image&, unsigned int, unsigned int, unsigned int, unsigned int);

private:
    unsigned char** i_data; // 2D array containing pixel values
    unsigned int i_width; // columns
    unsigned int i_height; // rows
    unsigned int i_max; // maximum color value
};

#endif // IMAGE_PROCESSING_IMAGE_H