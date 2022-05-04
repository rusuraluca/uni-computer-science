cmake_minimum_required(VERSION 3.21)
project(image_processing)

set(CMAKE_CXX_STANDARD 14)

include_directories(.)
include_directories(Utils)
include_directories(ImageProcessing)

add_executable(image_processing
        Utils/Point.h
        Utils/Point.cpp
        Utils/Rectangle.h
        Utils/Rectangle.cpp
        Utils/Size.h
        Utils/Size.cpp
        Utils/Vector.h
        Utils/Vector.cpp
        ImageProcessing/ConvolutionProcessor.cpp
        ImageProcessing/ConvolutionProcessor.h
        ImageProcessing/GammaCorrectionProcessor.cpp
        ImageProcessing/GammaCorrectionProcessor.h
        ImageProcessing/BrightnessContrastAdjustmentProcessor.cpp
        ImageProcessing/BrightnessContrastAdjustmentProcessor.h
        ImageProcessing/ImageProcessing.h
        DrawingShapes.cpp
        DrawingShapes.h
        Image.cpp
        Image.h
        ImageProcesses.h
        Tests.h
        Tests.cpp
        Utils.h
        main.cpp)
