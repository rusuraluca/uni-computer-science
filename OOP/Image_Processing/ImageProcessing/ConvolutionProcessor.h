//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_CONVOLUTIONPROCESSOR_H
#define IMAGE_PROCESSING_CONVOLUTIONPROCESSOR_H

#include "ImageProcessing.h"

enum class ConvolutionType {
    IDENTITY,
    MEAN_BLUR,
    GAUSSIAN_BLUR,
    HORIZONTAL_SOBEL,
    VERTICAL_SOBEL
};

class ConvolutionProcessor : public ImageProcessing {
public:
    friend unsigned char downScale255(long, int);

    // Uses preset kernel and downscale255
    ConvolutionProcessor(ConvolutionType);

    // Uses preset kernel and CUSTOM downscaler
    ConvolutionProcessor(ConvolutionType, unsigned char (*)(long, int));

    // Only accepting square kernels of uneven size
    // Uses CUSTOM kernel and CUSTOM downscaler
    ConvolutionProcessor(std::vector<std::vector<int>>, int, unsigned char (*)(long, int));

    void process(const Image&, Image&) override;

private:
    std::vector<std::vector<int>> kernel;
    int kernelWidth;
    unsigned char (*downScaler)(long, int);
};

#endif //IMAGE_PROCESSING_CONVOLUTIONPROCESSOR_H
