#include "Image.h"
#include "DrawingShapes.h"
#include "Tests.h"

int main(){
    Tests::runAllTests();

    Image img, img2, img3, img4, img5, img6, img7, img8, img9, img10;
    img.load("feep.ascii.pgm");
    img2 = img;
    DrawingShapes::drawCircle(img2, Point(3, 3), 2, 36, true);
    img2.save("feep_draw_circle.ascii.pgm");

    img3 = img;
    DrawingShapes::drawLine(img3, Point(1, 1), Point(8, 1), 255, true);
    img3.save("feep_draw_line.ascii.pgm");

    img4 = img;
    DrawingShapes::drawRectangle(img4, Rectangle(3, 5, 1, 1), 255, true);
    img4.save("feep_draw_rectangle1.ascii.pgm");

    img5 = img;
    DrawingShapes::drawRectangle(img5, Point(1, 1), Point(3, 3), 255, true);
    img5.load("feep_draw_rectangle2.ascii.pgm");

    img6 = img;
    ConvolutionProcessor conv1(ConvolutionType::VERTICAL_SOBEL);
    conv1.process(img, img6);
    img6.save("feep_conv_vert.ascii.pgm");

    img7 = img;
    ConvolutionProcessor conv2(ConvolutionType::GAUSSIAN_BLUR);
    conv2.process(img, img7);
    img7.save("feep_conv_gauss.ascii.pgm");

    img8 = img;
    ConvolutionProcessor conv3(ConvolutionType::HORIZONTAL_SOBEL);
    conv3.process(img, img8);
    img8.save("feep_conv_horiz.ascii.pgm");

    img9 = img;
    ConvolutionProcessor conv4(ConvolutionType::IDENTITY);
    conv4.process(img, img9);
    img9.save("feep_conv_ident.ascii.pgm");

    img10 = img;
    ConvolutionProcessor conv5(ConvolutionType::MEAN_BLUR);
    conv5.process(img, img10);
    img10.save("feep_conv_meanblur.ascii.pgm");
    return 0;
}