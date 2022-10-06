#include "Tests.h"

void Tests::runAllTests(){
    std::cout<<"Tests.h test begin\n";
    std::cout<<"Image Test... \n";
    ImageTest();
    std::cout<<"Point Test... \n";
    PointTest();
    std::cout<<"Rectangle Test... \n";
    RectangleTest();
    std::cout<<"Size Test... \n";
    SizeTest();
    std::cout<<"Vector Test... \n";
    VectorTest();
    std::cout<<"Brightness Contrast Adjustment Test... \n";
    BrightnessContrastAdjustmentProcessorTest();
    std::cout<<"Gamma Correction Test... \n";
    GammaCorrectionProcessorTest();
    std::cout<<"Convolution Processor Test... \n";
    ConvolutionProcessorTest();
    std::cout<<"Drawing Shapes Test... \n";
    DrawingShapesTest();
    std::cout<<"Tests.h test end\n";
}

int Tests::PointTest() {
    Point p0;
    Point p(2, 5);
    assert(p0.getX() == 0);
    assert(p0.getY() == 0);
    assert(p.getX() == 2);
    assert(p.getY() == 5);
    p0.setX(3);
    p0.setY(7);
    assert(p0.getX() == 3);
    assert(p0.getY() == 7);
    Point p2 = p;
    assert(p2.getX() == p.getX());
    assert(p2.getY() == p.getY());

    unsigned long x = 10;
    unsigned long y = 20;

    Point a(x, y);

    std::ostringstream sstr;
    std::string s = "(10,20)";
    sstr << a;
    assert(sstr.str().compare(s) == 0);

    assert(a.getY() == y);
    assert(a.getX() == x);

    Point b(x, 0);
    b.setY(y);
    assert(b.getY() == y);

    Point c(0, y);
    c.setX(x);
    assert(c.getX() == x);

    b = a;
    assert(b.getX() == x);
    assert(b.getY() == y);

    Point d(a);
    assert(d.getX() == x);
    assert(d.getY() == y);
}

int Tests::RectangleTest() {
    Rectangle r(5, 2, 1, 1);
    Rectangle r2(10, 3, 5, 5);

    assert(r.getHeight() == 2);
    assert(r.getWidth() == 5);
    assert(r.getCornerX() == 1);
    assert(r.getCornerY() == 1);
    r.setCorner(Point(2, 2));
    assert(r.getCornerX() == 2);
    assert(r.getCornerY() == 2);
    r.setSize(Size(4, 6));
    assert(r.getHeight() == 6);
    assert(r.getWidth() == 4);
    r.setCornerX(3);
    r.setCornerY(4);
    assert(r.getCornerX() == 3);
    assert(r.getCornerY() == 4);
    r.setHeight(5);
    r.setWidth(7);
    assert(r.getHeight() == 5);
    assert(r.getWidth() == 7);

    Rectangle r3(0, 0, 0, 0), r4(0, 0, 0, 0);
    Vector v(4, 5);
    Vector v1(2, 2);

    r3 = r + v;
    assert(r3.getCornerX() == 7);
    assert(r3.getCornerY() == 9);

    r4 = r3 - v1;
    assert(r4.getCornerX() == 5);
    assert(r4.getCornerY() == 7);

    Rectangle rect1(5, 5, 1, 1);
    Rectangle rect2(5, 5, 2, 2);
    Rectangle rect3(0, 0, 0, 0);

    rect3 = rect1 & rect2;

    assert(rect3.getCornerX() == 2);
    assert(rect3.getCornerY() == 2);
    assert(rect3.getHeight() == 4);
    assert(rect3.getWidth() == 4);

    try {
        Rectangle rect4(1, 2, 100, 100);
        rect4 = rect4 & rect3;
        assert(false);
    }
    catch (...) {
        assert(true);
    }

    rect1 = Rectangle(5, 5, 1, 1);
    rect2 = Rectangle(2, 5, 6, 6);
    rect3 = rect1 | rect2;

    assert(rect3.getWidth() == 7);

    assert(rect3.getSize().getWidth() == 7);

    Rectangle SPrect(Size(5, 5), Point(1, 1));
    assert(SPrect.getCornerX() == 1);
    assert(SPrect.getWidth() == 5);

    Point topLeft_corner(4, 3);
    Point bottomRight_corner(5, 8);

    Rectangle rect(topLeft_corner, bottomRight_corner);

    assert(rect.getTopLeft().getX() == 4);
    assert(rect.getTopLeft().getY() == 3);

    try {
        Rectangle rect1(bottomRight_corner, topLeft_corner);
        assert(false);
    }
    catch (...) {
        assert(true);
    }

    assert(rect.getCorner().getX() == 4);
}

int Tests::SizeTest() {
    unsigned long height = 10, width = 10;
    Size a;
    a.setHeight(height);
    assert(a.getHeight() == height);
    a.setWidth(width);
    assert(a.getWidth() == width);
    Size b(width+1, height+1);
    assert(b.getHeight() == (height+1));
    assert(b.getWidth() == (width+1));
    assert(b.getSize() == (height+1)*(width+1));

    height = 15, width = 14;
    Size c(width, height);
    a = c;
    assert(a.getHeight() == height);
    assert(a.getWidth() == width);
    assert(a.getSize() == height*width);

    Size d(a);
    assert(d.getHeight() == height);
    assert(d.getWidth() == width);
    assert(d.getSize() == height*width);

    Size e;
    assert(e.getHeight() == 0);
    assert(e.getWidth() == 0);
    assert(e.getSize() == 0);
}

int Tests::VectorTest() {
    Vector v(1, 2);
    Vector v2;
    assert(v.getX() == 1);
    v2.setX(3);
    v2.setY(200);
    assert(v2.getX() == 3);
    v2 = v;
    assert(v2.getX() == 1);
}

int Tests::ImageTest() {
    Image img;
    img.load("mona_lisa.ascii.pgm");
    img.save("mona_lisa_saved.ascii.pgm");
    Image voidImg;
    assert(voidImg.getWidth() == 0);
    Image paramImg(10, 20);
    assert(paramImg.getWidth() == 10);
    Image copyImg(paramImg);
    assert(copyImg.getWidth() == 10);
    Image assignImg = paramImg;
    assert(assignImg.getWidth() == 10);
    Image sizeImg(Size{10, 20});
    assert(sizeImg.getWidth() == 10);

    Image temp = Image::generateFilled(3, 4, 5);
    assert(temp.getWidth() == 3);
    assert(temp.getHeight() == 4);
    assert(temp.at(2,1) == 5);
    temp = Image::zeros(2, 2);
    assert(temp.getWidth() == 2);
    assert(temp.at(0,1) == 0);
    temp = Image::ones(2, 2);
    assert(temp.at(0,1) == 1);
    temp = Image::max(1, 1);
    assert(temp.at(0,0) == 255);
    temp.at(0,0) = 2;
    temp.updateMax();
    temp.release();

    Image temp1(10, 20), temp2;
    temp1.at(1,2) = 10;
    temp1.updateMax();
    temp2 = temp1;
    assert(temp2.at(1,2) == 10);
    assert(temp2.getWidth() == 10);
    assert(temp1 != temp2);
    temp2.at(1,3) = 2;
    assert(temp2 != temp);
    temp1 = temp1 + Image::ones(10, 20);
    temp1 = temp1 - Image::generateFilled(10, 20, 3);
    temp1 = temp1 * Image::generateFilled(10, 20, 2);
    temp1 = temp1 + 10;
    temp1 = temp1 - 3;
    temp1 = temp1 * 3;

    temp = Image::generateFilled(4, 6, 1);
    temp.at(2,3) = 2;
    temp.at(2,1) = 12;
    temp.updateMax();
    Image temp3;
    temp.getROI(temp2, 1, 1, 2, 2);
    assert(temp2.at(1,0) == 12);
    temp.getROI(temp2, 2, 2, 2, 2);
    temp.getROI(temp2, Rectangle{2, 2, 2, 2});
    temp.release();
    assert(temp.getROI(temp2, 2, 2, 2, 2) == false);

}

int Tests::BrightnessContrastAdjustmentProcessorTest(){
    Image img1, img2;
    img1.load("mona_lisa.ascii.pgm");
    BrightnessContrastAdjustmentProcessor b(3, 6);
    b.process(img1, img2);
    img2.save("mona_lisa_bcap.ascii.pgm");

    BrightnessContrastAdjustmentProcessor processorempty;
    assert(processorempty.getGain() == 1);
    assert(processorempty.getBias() == 0);

    BrightnessContrastAdjustmentProcessor processor(2, 4);
    assert(processor.getGain() == 2);
    assert(processor.getBias() == 4);

    Image image1 = Image::zeros(1, 1), image2;
    processor.process(image1, image2);

    assert(image1.at(0, 0) == 0);
}

int Tests::GammaCorrectionProcessorTest(){
    Image img1, img2, img;
    img1.load("mona_lisa.ascii.pgm");
    GammaCorrectionProcessor g1(-10), g2(10);
    g1.process(img1, img2);
    img2.save("mona_lisa_gc_minus.ascii.pgm");

    g2.process(img1, img2);
    img2.save("mona_lisa_gc_plus.ascii.pgm");

    GammaCorrectionProcessor emptyprocessor;
    assert(emptyprocessor.getFactor() == 1);

    GammaCorrectionProcessor processor(2);
    assert(processor.getFactor() == 2);

    Image image1 = Image::generateFilled(5, 5, 2), image2;
    processor.process(image1, image2);

    assert(image2.at(0, 1) == 4);
}

int Tests::ConvolutionProcessorTest(){
    Image img1, img2;
    img1.load("mona_lisa.ascii.pgm");
    ConvolutionProcessor conv1(ConvolutionType::VERTICAL_SOBEL);
    conv1.process(img1, img2);
    img2.save("mona_lisa_conv_vert.ascii.pgm");

    img1.load("mona_lisa.ascii.pgm");
    ConvolutionProcessor conv2(ConvolutionType::GAUSSIAN_BLUR);
    conv2.process(img1, img2);
    img2.save("mona_lisa_conv_gauss.ascii.pgm");

    img1.load("mona_lisa.ascii.pgm");
    ConvolutionProcessor conv3(ConvolutionType::HORIZONTAL_SOBEL);
    conv3.process(img1, img2);
    img2.save("mona_lisa_conv_horiz.ascii.pgm");

    img1.load("mona_lisa.ascii.pgm");
    ConvolutionProcessor conv4(ConvolutionType::IDENTITY);
    conv4.process(img1, img2);
    img2.save("mona_lisa_conv_ident.ascii.pgm");

    img1.load("mona_lisa.ascii.pgm");
    ConvolutionProcessor conv5(ConvolutionType::MEAN_BLUR);
    conv5.process(img1, img2);
    img2.save("mona_lisa_conv_meanblur.ascii.pgm");

    ConvolutionProcessor procesor(ConvolutionType::GAUSSIAN_BLUR);
    Image src = Image::generateFilled(5, 5, 2), dst;
    procesor.process(src, dst);
    assert(dst.at(1, 1) == 32);
    ConvolutionProcessor procesor2(ConvolutionType::IDENTITY);
    procesor2.process(src, dst);
    assert(dst.at(1, 1) == 2);
}

int Tests::DrawingShapesTest(){
    Image img, img1, img2;
    img1.load("mona_lisa.ascii.pgm");
    img2 = img1;
    DrawingShapes::drawCircle(img2, Point(100, 100), 50, 0, true);
    img2.save("mona_lisa_draw_circle.ascii.pgm");

    Image img3, img4, img5;
    img3 = img1;
    DrawingShapes::drawLine(img3, Point(30, 30), Point(125, 125), 0, true);
    img3.save("mona_lisa_draw_line.ascii.pgm");

    img4 = img1;
    DrawingShapes::drawRectangle(img4, Rectangle(125, 90, 30, 30), 0, true);
    img4.save("mona_lisa_draw_rectangle1.ascii.pgm");

    img5 = img1;
    DrawingShapes::drawRectangle(img5, Point(30, 30), Point(125, 90), 0, true);
    img5.load("mona_lisa_draw_rectangle2.ascii.pgm");

    Image img6, img7, img8;
    img6.load("feep.ascii.pgm");
    img7 = img6;
    DrawingShapes::drawCircle(img7, Point(3, 3), 2, 36, true);
    img7.save("feep_draw_circle.ascii.pgm");

    img8 = img6;
    DrawingShapes::drawLine(img8, Point(1, 1), Point(8, 1), 255, true);
    img8.save("feep_draw_line.ascii.pgm");

    Image img9, img10, img11;
    img9 = img6;
    DrawingShapes::drawRectangle(img9, Rectangle(3, 5, 1, 1), 255, true);
    img9.save("feep_draw_rectangle1.ascii.pgm");

    img10 = img6;
    DrawingShapes::drawRectangle(img10, Point(0, 0), Point(4, 4), 255, true);
    img10.load("feep_draw_rectangle2.ascii.pgm");

    Image image = Image::generateFilled(100, 100, 2);
    DrawingShapes::drawCircle(image, Point(50,50), 10, 3, true);
    assert(image.at(52,57) == 3);

    Image image2 = Image::generateFilled(100, 100, 2);
    DrawingShapes::drawLine(image2, Point(50,50), Point(50,60), 3, true);
    DrawingShapes::drawLine(image2, Point(50,50), Point(60,50), 3, true);
    assert(image2.at(50,50) == 3);

    Image image3 = Image::generateFilled(100, 100, 2);
    DrawingShapes::drawRectangle(image3, Point(10,10), Point(60,60), 5, false);
    assert(image3.at(50,50) == 7);
    DrawingShapes::drawRectangle(image3, Rectangle(20,20,2,2), 20, true);
}