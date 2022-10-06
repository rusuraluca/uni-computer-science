//
// Created by Raluca on 28.03.2022.
//
#include "BrightnessContrastAdjustmentProcessor.h"

BrightnessContrastAdjustmentProcessor::BrightnessContrastAdjustmentProcessor(){
    this->gain = 1;
    this->bias = 0;
}

BrightnessContrastAdjustmentProcessor::BrightnessContrastAdjustmentProcessor(unsigned int _gain, int _bias){
    this->gain = _gain;
    this->bias = _bias;
}

void BrightnessContrastAdjustmentProcessor::process(const Image& src, Image& dst){
    dst.release();
    dst = Image(src.size());
    for (int i = 0; i < src.getHeight(); i++) {
        for (int j = 0; j < src.getWidth(); j++) {
            dst.at(i, j) = valid_char((this->gain * int(src.atConst(i, j))) + this->bias);
        }
    }
    dst.updateMax();
}

unsigned int BrightnessContrastAdjustmentProcessor::getGain() const{
    return this->gain;
}

int BrightnessContrastAdjustmentProcessor::getBias() const{
    return this->bias;
}
