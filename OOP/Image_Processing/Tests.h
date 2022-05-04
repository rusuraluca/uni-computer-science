//
// Created by Raluca on 28.03.2022.
//
#pragma once

#ifndef IMAGE_PROCESSING_TESTS_H
#define IMAGE_PROCESSING_TESTS_H

#include "Image.h"
#include "ImageProcesses.h"
#include "DrawingShapes.h"
#include <iostream>
#include <cassert>

class Tests{
public:
    static void runAllTests();
private:
    static int PointTest();
    static int RectangleTest();
    static int SizeTest();
    static int VectorTest();
    static int ImageTest();
    static int BrightnessContrastAdjustmentProcessorTest();
    static int GammaCorrectionProcessorTest();
    static int ConvolutionProcessorTest();
    static int DrawingShapesTest();
};

#endif // IMAGE_PROCESSING_TESTS_H