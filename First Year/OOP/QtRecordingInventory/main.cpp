#include "mainwindow.h"
#include "Controller/Controller.h"
#include "Domain/Recording.h"
#include "Persistency/FileRepo.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    FileRepo<Recording> filerepo{"/Users/raluca/Desktop/QtRecordingInventory/inventory.csv"};
    Controller<Recording> ctrl{filerepo};

    MainWindow w(&ctrl);
    w.show();
    return a.exec();
}
