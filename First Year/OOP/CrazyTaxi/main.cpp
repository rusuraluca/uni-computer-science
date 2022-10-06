#include "mainwindow.h"
#include "gui.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    RepoTaxi repo;

    Service srv(repo);
    Gui g(srv);
    g.show();
    return a.exec();
}
