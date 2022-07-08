#include "gui.h"

void Gui::paintEvent(QPaintEvent *event){
    QPainter painter(this);
    QPixmap img("taxi.png");
    painter.drawRect(10, 10, 20, 20);
    auto all = srv.get_all();
    for(auto taxi:all){
        painter.drawPixmap(taxi.getLat(), taxi.getLon(), img);
    }
}

Gui::Gui(Service& srv): srv{srv}{
    this->setFixedWidth(600);
    this->setFixedHeight(400);
}
