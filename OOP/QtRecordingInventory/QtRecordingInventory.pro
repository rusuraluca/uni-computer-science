QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    Controller/Controller.cpp \
    Domain/Podcast.cpp \
    Domain/Recording.cpp \
    Domain/Vlog.cpp \
    Exceptions/Exceptions.cpp \
    Persistency/FileRepo.cpp \
    Persistency/Repo.cpp \
    Tests/Tests.cpp \
    main.cpp \
    mainwindow.cpp

HEADERS += \
    Controller/Controller.h \
    Domain/Podcast.h \
    Domain/Recording.h \
    Domain/Vlog.h \
    Exceptions/Exceptions.h \
    Persistency/FileRepo.h \
    Persistency/Repo.h \
    Tests/Tests.h \
    mainwindow.h

FORMS += \
    mainwindow.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES += \
    inventory.csv \
    test-inventory.csv
