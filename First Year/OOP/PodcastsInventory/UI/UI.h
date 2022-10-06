//
// Created by Raluca on 07.05.2022.
//
#pragma once
#include "../Controller/Controller.h"
#include <string>
#include <iostream>
#include <exception>

/*!
 * \class  UI.
 * \brief  User Interface Console.
 */
class UI {
private:
    Controller<Recording> ctrl;
public:
    UI(const Controller<Recording> &ctrl) : ctrl{ctrl} {};
    ~UI(){};

    void runApplication();
    void runAdminMode();
    void runUserMode();

private:
    static void printMenu();
    static void printMenuAdmin();
    static void printMenuUser();

    void add();
    void remove();
    void update();
    void getAll();
    void size();
    void displayByLengthLowerThan();
    void undo();
    void redo();
};