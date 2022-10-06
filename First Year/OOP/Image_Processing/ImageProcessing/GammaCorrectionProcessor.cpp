//
// Created by Raluca on 28.03.2022.
//
#include "GammaCorrectionProcessor.h"

// Default constructor
GammaCorrectionProcessor::GammaCorrectionProcessor(){
    this->factor = 1;
}

GammaCorrectionProcessor:: GammaCorrectionProcessor(int _factor){
    this->factor = _factor;
}

int GammaCorrectionProcessor::getFactor() const{
    return this->factor;
}

void GammaCorrectionProcessor::process(const Image& src, Image& dst){
    dst.release();
    dst = Image(src.size());
    for (int i = 0; i < src.getHeight(); i++) {
        for (int j = 0; j < src.getWidth(); j++) {
            dst.at(i, j) = valid_char(pow(int(src.atConst(i, j)), this->factor));
        }
    }
    dst.updateMax();
}
