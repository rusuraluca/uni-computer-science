#include "observer.h"

void Subject::notifyObsevers(){
    for(Observer* o: observers){
        o->update();
    }
}


int main(){
    Subject s{100};

    // !!! don't do this in other functions than main
    EmailSending e{&s};
    PlotChart p{&s};

    s.registerObserver(&e);
    s.registerObserver(&p);

    s.setVal(5);
    s.setVal(74);


}
