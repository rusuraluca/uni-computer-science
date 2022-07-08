#ifndef COMPOSITE_H
#define COMPOSITE_H
#include <iostream>
#include <vector>
using std::cout;
using std::endl;
using std::vector;

class Graphic
{
public:
    Graphic() = default;
    virtual void draw() = 0;
};

// leaf
class Line: public Graphic{
public:
    void draw() override {
        cout<<"line draw"<<endl;
    }
};

class Rectangle: public Graphic{
public:
    void draw() override {
        cout<<"rectangle draw"<<endl;
    }
};


class Picture: public Graphic{
public:
    void draw() override {
        cout<<"drawing a composite: "<<endl;
        for(Graphic* comp: components){
            comp->draw();
        }
        cout<<"----"<<endl;
    }
    void addComponent(Graphic* g){
        components.push_back(g);
    }
private:
    vector<Graphic*> components;
};

#endif // COMPOSITE_H
