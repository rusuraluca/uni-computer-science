//
// Created by Raluca on 28.03.2022.
//
#include "Image.h"

// Default constructor
Image::Image() : i_width(0), i_height(0), i_max(0), i_data(nullptr) {}

Image::Image(unsigned int w, unsigned int h) : i_width(w), i_height(h), i_max(0) {
    this->i_data = new unsigned char *[h];
    for (int i = 0; i < h; i++)
        this->i_data[i] = new unsigned char[w]{0};
}

Image::Image(const Size &size) : i_width(size.width), i_height(size.height), i_max(0) {
    this->i_data = new unsigned char *[size.height];
    for (int i = 0; i < size.height; i++)
        this->i_data[i] = new unsigned char[size.width];
}

// Copy constructor
Image::Image(const Image &other){
    this->i_width = other.i_width;
    this->i_height = other.i_height;
    this->i_max = other.i_max;

    // Reallocate memory
    this->i_data = new unsigned char *[this->i_height];
    for (int i = 0; i < this->i_height; ++i)
        this->i_data[i] = new unsigned char[this->i_width];

    // Copy the matrix
    for (int i = 0; i < this->i_height; ++i)
        for (int j = 0; j < this->i_width; ++j)
            this->i_data[i][j] = other.i_data[i][j];
}

// Destructor
Image::~Image(){
    release();
}

// Copy assignment operator
Image& Image::operator=(const Image &other){
    if (this == &other)
        return *this;

    for (int i = 0; i < this->i_height; ++i)
        delete[] this->i_data[i];
    delete[] this->i_data;

    this->i_width = other.i_width;
    this->i_height = other.i_height;

    this->i_data = new unsigned char *[this->i_height];
    for (int i = 0; i < this->i_height; i++)
        this->i_data[i] = new unsigned char[this->i_width];
    for (int i = 0; i < this->i_height; i++)
        for (int j = 0; j < this->i_width; j++)
            this->i_data[i][j] = other.i_data[i][j];

    return *this;
}

// Getter for the width of the image
unsigned int Image::getWidth() const{
    return this->i_width;
}

// Getter for the height of the image
unsigned int Image::getHeight() const{
    return this->i_height;
}

Size Image::size() const {
    return {this->i_width, this->i_height};
}

// A method that returns whether the image is empty or not
bool Image::isEmpty() const {
    return i_data == nullptr;
}

// A method that releases the memory allocated for the image
void Image::release() {
    for (int i = 0; i < this->i_height; ++i)
        delete[] this->i_data[i];
    delete[] this->i_data;
    this->i_height = 0;
    this->i_width = 0;
    this->i_max = 0;
    this->i_data = nullptr;
}

void Image::updateMax() {
    int max = -1;
    for (int i = 0; i < this->i_height; i++)
        for (int j = 0; j < this->i_width; j++)
            if (this->i_data[i][j] > max)
                max = this->i_data[i][j];
    this->i_max = max;
}

//Load an image from/to a .pgm file
// may be over-engineered - just be able to parse comments - ghinion
bool Image::load(const std::string &imagePath) {
    std::ifstream pgmSrc(imagePath);
    std::string type = "0";
    unsigned int width = 0, height = 0;
    unsigned char maxval = 0;
    unsigned int temp_int;
    std::string line;
    std::regex r("\\s+");
    while (std::getline(pgmSrc, line)) {
        std::istringstream iss(line);
        std::string clean_line = std::regex_replace(line, r, ""); //removing whitespace for next instr
        if (clean_line[0] == '#' || line.empty())
            continue; //if a line is commented, it skips it
        if (type == "0") {
            iss >> type;
            if (type != "P2") //only accepts plain PGM
                return false;
            continue;
        }
        if (width == 0 && height == 0) {
            iss >> width >> height;
            continue;
        }
        if (maxval == 0) {
            iss >> temp_int;
            maxval = valid_char(temp_int);
        }
        if (type != "0" && width && height && maxval)
            break;
    }
    if (type == "0" || !width || !height || !maxval) //if a file ends before these are given, load() fails
        return false;

    Image temp_image(width, height);
    temp_image.i_max = maxval;
    long int h = -1;
    long int w;
    while (std::getline(pgmSrc, line)) { //going through the matrix row by row
        std::istringstream iss(line); //and turning them into string streams
        string clean_line = std::regex_replace(line, r, "");
        if (clean_line[0] == '#' || line.empty()) //if a line is commented, it skips it
            continue;
        w = -1;
        if (++h >= height) //if the number of rows is greater than the given height, load() fails
            return false;
        while (iss >> temp_int) { //while the row is not empty, the elements are parsed
            if (++w >= width) //if the length of a given row is greater than the given width, load() fails
                return false;
            temp_image.i_data[h][w] = valid_char(temp_int); //each read int is clamped (0,255)
        }
        if (w < width - 1) //if the length of a row< given width, load() fails
            return false;
    }
    if (h < height - 1) //if number of rows< given height, load() fails
        return false;

    *this = temp_image;
    pgmSrc.close();
    return true;
}

// Save an image from/to a .pgm file
bool Image::save(const std::string &imagePath) {
    std::regex r("^.*\.(pgm|PGM)$");
    // Path must end in .pgm
    if (!std::regex_match(imagePath, r))
        return false;

    if (this->isEmpty())
        return false;

    std::ofstream pgmBuild(imagePath);

    pgmBuild << "P2\n";
    pgmBuild << this->i_width << " " << this->i_height << endl;
    pgmBuild << this->i_max << endl;
    for (int i = 0; i < this->i_height; i++) {
        for (int j = 0; j < this->i_width; j++)
            pgmBuild << (int) this->i_data[i][j] << "  ";
        pgmBuild << endl;
    }

    pgmBuild.close();
    return true;
}

// A method that returns a reference to the pixel at a given location in the image
// one in which you specify the pixel’s position with two values
unsigned char &Image::at(unsigned int y, unsigned int x) {
    if (x > this->i_width - 1 || y > this->i_height - 1)
        throw std::out_of_range("Invalid index");
    return this->i_data[y][x];
}

unsigned char Image::atConst(unsigned int y, unsigned int x) const {
    if (x > this->i_width - 1 || y > this->i_height - 1)
        throw std::out_of_range("Invalid index");
    return this->i_data[y][x];
}

// A method that returns a reference to the pixel at a given location in the image
// one in which you specify the pixel’s position with a Point class (that has two fields x and y)
unsigned char &Image::at(Point &pt) {
    if (pt.getX() > this->i_width - 1 || pt.getY() > this->i_height - 1)
        throw std::out_of_range("Invalid index");
    return this->i_data[pt.getY()][pt.getX()];
}

// A method that returns a pointer to a row in the image
unsigned char *Image::row(int y) {
    if (y > this->i_height)
        throw std::out_of_range("Invalid index");
    return this->i_data[y];
}

// Ostream operator
std::ostream &operator<<(std::ostream &stream, const Image &dt){
    for (int i = 0; i < dt.i_height; i++) { //copy the matrix
        for (int j = 0; j < dt.i_width; j++) {
            stream << std::setw(3) << int(dt.i_data[i][j]);
        }
        stream << endl;
    }
    return stream;
}

// Overload for the + arithmetic operator between two images
Image Image::operator+(const Image &i){
    if(this->size() != i.size())
        throw std::invalid_argument("The images should be of equal size!");

    Image result(this->i_width, this->i_height);
    int result_aux;
    for (int k = 0; k < this->i_height; k++)
        for (int j = 0; j < this->i_width; j++) {
            result_aux = (int) this->i_data[k][j] + (int) i_data[k][j];
            result.i_data[k][j] = valid_char(result_aux);
        }

    result.updateMax();
    return result;
}

// Overload for the - arithmetic operator between two images
Image Image::operator-(const Image &i){
    if(this->size() != i.size())
        throw std::invalid_argument("The images should be of qual size!");

    Image result(this->i_width, this->i_height);
    int result_aux;
    for (int k = 0; k < this->i_height; k++)
        for (int j = 0; j < this->i_width; j++) {
            result_aux = (int) this->i_data[k][j] - (int) i_data[k][j];
            result.i_data[k][j] = valid_char(result_aux);
        }

    result.updateMax();
    return result;
}

// Overload for the * arithmetic operator between two images
Image Image::operator*(const Image &i){
    if(this->size() != i.size())
        throw std::invalid_argument("The images should be of qual size!");

    Image result(this->i_width, this->i_height);
    int result_aux;
    for (int k = 0; k < this->i_height; k++)
        for (int j = 0; j < this->i_width; j++) {
            result_aux = (int) this->i_data[k][j] * (int) i_data[k][j];
            result.i_data[k][j] = valid_char(result_aux);
        }

    result.updateMax();
    return result;
}

// Overload for the + arithmetic operator between an image and a scalar value
Image Image::operator+(const int &alfa) {
    Image temp(this->i_width, this->i_height);
    int temp_int;
    for (int i = 0; i < this->i_height; i++)
        for (int j = 0; j < this->i_width; j++) {
            temp_int = (int) this->i_data[i][j] + alfa;
            temp.i_data[i][j] = valid_char(temp_int);
        }

    temp.updateMax();
    return temp;
}

// Overload for the - arithmetic operator between an image and a scalar value
Image Image::operator-(const int &alfa) {
    Image temp(this->i_width, this->i_height);
    int temp_int;
    for (int i = 0; i < this->i_height; i++)
        for (int j = 0; j < this->i_width; j++) {
            temp_int = (int) this->i_data[i][j] - alfa;
            temp.i_data[i][j] = valid_char(temp_int);
        }

    temp.updateMax();
    return temp;
}

// Overload for the * arithmetic operator between an image and a scalar value
Image Image::operator*(const int &alfa) {
    Image temp(this->i_width, this->i_height);
    int temp_int;
    for (int i = 0; i < this->i_height; i++)
        for (int j = 0; j < this->i_width; j++) {
            temp_int = (int) this->i_data[i][j] * alfa;
            temp.i_data[i][j] = valid_char(temp_int);
        }

    temp.updateMax();
    return temp;
}

bool operator==(const Image &A, const Image &B) {
    if (A.i_height != B.i_height ||
        A.i_width != B.i_width ||
        A.i_max != B.i_max)
        return false;
    for (int i = 0; i < A.i_height; i++)
        for (int j = 0; j < A.i_width; j++)
            if (A.i_data[i][j] != B.i_data[i][j])
                return false;
    return true;
}

bool operator!=(const Image &A, const Image &B) {
    return !(A == B);
}

// Static method that create an image filled with zeros
Image Image::zeros(unsigned int width, unsigned int height){
    Image result(width, height);

    for (int i = 0; i < result.i_height; ++i)
        for (int j = 0; j < result.i_width; ++j)
            result.i_data[i][j] = 0;

    return result;
}

// Static method that create an image filled with ones
Image Image::ones(unsigned int width, unsigned int height){
    Image result(width, height);

    for (int i = 0; i < result.i_height; ++i)
        for (int j = 0; j < result.i_width; ++j)
            result.i_data[i][j] = 1;

    return result;
}

bool Image::getROI(Image &roiImg, const Rectangle &roiRect) {
    return this->getROI(roiImg, roiRect.getCornerX(), roiRect.getCornerY(), roiRect.getWidth(), roiRect.getWidth());
}

bool Image::getROI(Image &roiImg, unsigned int x, unsigned int y, unsigned int width, unsigned int height) {
    if (x + width > this->i_width || y + height > this->i_height)
        return false;
    if (!roiImg.isEmpty())
        roiImg.release();

    roiImg = Image(width, height);
    for (int i = 0; i < height; i++)
        for (int j = 0; j < width; j++)
            *(*(roiImg.i_data + i) + j) = *(*(this->i_data + y + i) + x + j);
    roiImg.updateMax();
    return true;
}

Image Image::max(unsigned int width, unsigned int height) {
    return generateFilled(width, height, 255);
}

Image Image::generateFilled(unsigned int width, unsigned int height, unsigned int value) {
    Image temp(width, height);
    for (int i = 0; i < height; i++)
        for (int j = 0; j < width; j++)
            temp.i_data[i][j] = valid_char(value);
    temp.i_max = valid_char(value);
    return temp;
}
