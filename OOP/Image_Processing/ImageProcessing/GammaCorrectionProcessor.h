//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_GAMMACORRECTIONPROCESSOR_H
#define IMAGE_PROCESSING_GAMMACORRECTIONPROCESSOR_H

#include "ImageProcessing.h"

class GammaCorrectionProcessor: public ImageProcessing{
public:
    // Default constructor
    GammaCorrectionProcessor();

    explicit GammaCorrectionProcessor(int);

    void process(const Image&, Image&) override;

    int getFactor() const;

private:
    int factor;
};

#endif //IMAGE_PROCESSING_GAMMACORRECTIONPROCESSOR_H