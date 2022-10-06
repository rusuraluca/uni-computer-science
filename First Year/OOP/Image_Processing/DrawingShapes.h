//
// Created by Raluca on 28.03.2022.
//
#ifndef IMAGE_PROCESSING_DRAWINGSHAPES_H
#define IMAGE_PROCESSING_DRAWINGSHAPES_H

#include "Image.h"

class DrawingShapes {
public:
    static bool drawLine(Image&, Point, Point, unsigned char, bool repl = true);
    static bool drawCircle(Image&, Point, int, unsigned char, bool repl = true);
    static bool drawRectangle(Image&, Rectangle, unsigned char, bool repl = true);
    static bool drawRectangle(Image&, Point, Point, unsigned char, bool repl = true);

private:
    static void plotLineLow(Image&, int, int, int, int, unsigned char, bool repl = true);
    static void plotLineHigh(Image&, int, int, int, int, unsigned char, bool repl = true);
};

#endif // IMAGE_PROCESSING_DRAWINGSHAPES_H