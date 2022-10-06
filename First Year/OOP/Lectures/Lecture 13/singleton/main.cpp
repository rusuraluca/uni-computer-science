#include <iostream>

using namespace std;

class Singleton{
private:
    static Singleton *instance;
    Singleton();

public:
    static Singleton* getInstance();
    Singleton(const Singleton& other) = delete;
    Singleton& operator=(const Singleton& other) = delete;
    ~Singleton(){
        if(instance){
            delete instance;
            instance = nullptr;
        }
    }
    void doSomething(){
        cout<<"doing some work "<<this<<endl;
    }
};

Singleton* Singleton::instance = nullptr;

Singleton::Singleton(){}

Singleton* Singleton::getInstance(){
    if(!instance)
        instance = new Singleton();
    return instance;
}


class Singleton2{
    Singleton2(){}
public:
    Singleton2(const Singleton2& other) = delete;
    Singleton2& operator=(const Singleton2& other) = delete;

    static Singleton2& getInstance(){
        static Singleton2 instance;
        return instance;
    }

    void doSomething(){
        cout<<"doing some work "<<this<<endl;
    }
};

void f1(){
    static int i = 0;
    i++;
    cout<<i<<endl;
    //
    Singleton* s = Singleton::getInstance();
    s->doSomething();
}

void f2(){
    //
    Singleton* s = Singleton::getInstance();
    s->doSomething();
}

int main()
{

    //    f1();
    //    f1();
    //    f1();
    //    f1();
    //    f2();

    Singleton2& v1 = Singleton2::getInstance();
    Singleton2& v2 = Singleton2::getInstance();
    //    Singletonv2 v3 = Singletonv2::getInstance();
    v1.doSomething();
    v1.doSomething();
    cout<<"--"<<endl;
    v2.doSomething();
    return 0;
}
