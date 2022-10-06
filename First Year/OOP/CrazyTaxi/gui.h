#ifndef GUI_H
#define GUI_H

#include "Business/Service.h"
#include <QWidget>
#include <QPaintEvent>
#include <QPainter>

class Gui:public QWidget{
private:
    Service& srv;
public:
    void paintEvent(QPaintEvent *event);
    Gui(Service&);

};

#endif // GUI_H
