//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_IMAGEPROCESSING_H
#define IMAGE_PROCESSING_IMAGEPROCESSING_H

#include "../Image.h"

// Base class for image processing
class ImageProcessing{
public:
    // Pure virtual method
    virtual void process(const Image&, Image&) = 0;
};

#endif //IMAGE_PROCESSING_IMAGEPROCESSING_H