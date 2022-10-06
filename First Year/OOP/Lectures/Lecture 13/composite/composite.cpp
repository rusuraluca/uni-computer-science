#include "composite.h"

int main(){
    Line* l1 = new Line();
    Rectangle* r1 = new Rectangle();

    Picture* p = new Picture();
    Line* lp1 = new Line();
    Line* lp2 = new Line();
    Rectangle* rp1 = new Rectangle();
    p->addComponent(lp1);
    p->addComponent(rp1);
    p->addComponent(lp2);

    l1->draw();
    r1->draw();
    p->draw();


    vector<Graphic*> v = {r1, l1, p};
    for(Graphic* g: v){
        if(dynamic_cast<Picture*>(g)!= nullptr){
            cout<<"is a picture";

        }else{
            cout<<"is a NOT picture";
        }
    }

}
