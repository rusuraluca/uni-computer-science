//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_BRIGHTNESSCONTRASTADJUSTMENTPROCESSOR_H
#define IMAGE_PROCESSING_BRIGHTNESSCONTRASTADJUSTMENTPROCESSOR_H

#include "ImageProcessing.h"

class BrightnessContrastAdjustmentProcessor: public ImageProcessing{
public:
    BrightnessContrastAdjustmentProcessor();
    BrightnessContrastAdjustmentProcessor(unsigned int, int);

    void process(const Image&, Image&) override;

    unsigned int getGain() const;
    int getBias() const;

private:
    unsigned int gain;
    int bias;
};

#endif //IMAGE_PROCESSING_BRIGHTNESSCONTRASTADJUSTMENTPROCESSOR_H

