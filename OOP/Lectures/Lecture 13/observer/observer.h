#ifndef OBSERVER_H
#define OBSERVER_H
#include <iostream>
#include <vector>
using std::cout;
using std::endl;
using std::vector;

class Observer;

class Subject{
    int val;
    vector<Observer*> observers;
public:
    Subject(int v){
        setVal(v);
    }
    int getVal(){
        return val;
    }

    void setVal(int v){
        cout<<"data changed "<<v<<endl;
        val = v;
        notifyObsevers();
    }
    void registerObserver(Observer* o){
        observers.push_back(o);
    }

    void notifyObsevers();
};



class Observer
{
public:
    Observer(Subject* sub):s{sub}{}
    virtual void update() = 0;

protected:
    Subject* s;
};

class EmailSending: public Observer{
public:
    EmailSending(Subject* sub):Observer{sub}{}
    void update() override{
        if(s->getVal() > 10){
            cout<<"send email"<<endl;
        }else{
            cout<<"don't send email"<<endl;
        }

    }
};

class PlotChart: public Observer{
public:
    PlotChart(Subject* sub):Observer{sub}{}
    void update() override{
        cout<<"plot chart with data"<<endl;
    }
};





#endif // OBSERVER_H
