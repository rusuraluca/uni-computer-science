//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_SIZE_H
#define IMAGE_PROCESSING_SIZE_H

// Class to represent the size (width, height and size of an image)
class Size {
public:
    friend class Image;

    // Default Constructor
    Size();

    Size(unsigned long, unsigned long);

    // Copy constructor
    Size(const Size&);

    // Copy assignment operator
    Size &operator=(const Size&);

    // Getters
    unsigned long getWidth() const;
    unsigned long getHeight() const;
    unsigned long getSize() const;

    // Setters
    void setWidth(unsigned long);
    void setHeight(unsigned long);
    void setSize(unsigned long);

    // Relational operators
    friend bool operator==(const Size&, const Size&);
    friend bool operator!=(const Size&, const Size&);

private:
    // Attributes
    unsigned long width;
    unsigned long height;
    unsigned long size;
};

#endif //IMAGE_PROCESSING_SIZE_H