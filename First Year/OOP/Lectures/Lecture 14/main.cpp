#include <iostream>

using namespace std;

class Animal{
public:
    Animal(){
        static int contor = 0;
        cout<<"constructor animal "<<contor;
        contor++;
    }
    void speak(){
        cout<<"animal";
    }
};

class CuAripi: virtual public Animal{
public:
    CuAripi(){
        cout<<"contructor cu aripi"<<endl;
    }
protected:
    int x;
};

class Mamifer: virtual public Animal{

public:
    Mamifer(){
        cout<<"contructor mamifer"<<endl;
    }
protected:
    int x;
};

class Bat: public Mamifer, public CuAripi {
public:
    Bat(){
        Mamifer::x = 5;
        CuAripi::x =0;
    }
};

int main()
{
    Bat l;
    l.speak();
    return 0;
}
