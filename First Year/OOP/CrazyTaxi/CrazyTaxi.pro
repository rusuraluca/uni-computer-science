QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    Business/Service.cpp \
    Domain/Taxi.cpp \
    Persistency/RepoTaxi.cpp \
    gui.cpp \
    main.cpp \
    mainwindow.cpp

HEADERS += \
    Business/Service.h \
    Domain/Taxi.h \
    Persistency/RepoTaxi.h \
    gui.h \
    mainwindow.h

FORMS += \
    mainwindow.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES += \
    file.csv \
    taxi.png
