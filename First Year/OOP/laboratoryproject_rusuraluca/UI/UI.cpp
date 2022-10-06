//
// Created by Raluca on 07.05.2022.
//
#include "UI.h"

void UI::runApplication(){
    while (true){
        try {
            printMenu();
            std::string command;
            std::getline(std::cin, command);
            if (command == "exit"){
                std::cout << "Bye!!!\n";
                break;
            }
            if (command == "admin"){
                std::cout << "Now you are in Admin mode\n";
                runAdminMode();
                std::cout << "You are no more in Admin mode! ^_^\n";
                continue;
            }
            if (command == "user"){
                std::cout << "Now you are in User mode\n";
                runUserMode();
                std::cout << "You are no more in User mode! ^_^\n";
                continue;
            }
            std::cout << "Invalid mode!\n";
        }
        catch (exception& e) {
            cout << "Standard exception: " << e.what() << endl;
        }
    }
}

void UI::runAdminMode(){
    while (true){
        try {
            printMenuAdmin();
            std::string command;
            std::getline(std::cin, command);
            if (command == "exit")
                break;
            if (command == "add"){
                try{
                    add();
                } catch (RepoException& e) {
                    cout << e.getMsg() << endl;
                } catch (ValidationException& e) {
                    cout << e.getMsg() << endl;
                }
                std::cout << '\n';
                continue;
            }
            if (command == "delete"){
                try{
                    remove();
                } catch (RepoException& e) {
                    cout << e.getMsg() << endl;
                } catch (ValidationException& e) {
                    cout << e.getMsg() << endl;
                }
                std::cout << '\n';
                continue;
            }
            if (command == "update"){
                try{
                    update();
                } catch (RepoException& e) {
                    cout << e.getMsg() << endl;
                } catch (ValidationException& e) {
                    cout << e.getMsg() << endl;
                }
                std::cout << '\n';
                continue;
            }
            if (command == "all"){
                getAll();
                std::cout << '\n';
                continue;
            }
            if (command == "size"){
                size();
                std::cout << '\n';
                continue;
            }
            if (command == "undo"){
                try{
                    undo();
                } catch (RepoException& e) {
                    cout << e.getMsg() << endl;
                } catch (ValidationException& e) {
                    cout << e.getMsg() << endl;
                }
                std::cout << '\n';
                continue;
            }
            if (command == "redo"){
                try{
                    redo();
                } catch (RepoException& e) {
                    cout << e.getMsg() << endl;
                } catch (ValidationException& e) {
                    cout << e.getMsg() << endl;
                }
                std::cout << '\n';
                continue;
            }
            std::cout << "Invalid command!\n\n";
        }
        catch (exception& e) {
            cout << "Standard exception: " << e.what() << endl;
        }
    }
}

void UI::runUserMode(){

}

void UI::printMenu(){
    std::cout << "Stop application:         exit\n";
    std::cout << "Select your mode from:    admin / user\n";
    std::cout << "You want: ";
}

void UI::printMenuAdmin(){
    std::cout << "add    - Add a recording\n";
    std::cout << "delete - Delete a recording\n";
    std::cout << "update - Update a recording\n";
    std::cout << "all    - List all recordings\n";
    std::cout << "size   - Number of all recordings\n";
    std::cout << "undo   - Undo last operation\n";
    std::cout << "redo   - Redo last operation\n";
    std::cout << "exit   - Exit\n";
    std::cout << "You want: ";
}

void UI::printMenuUser(){

}

void UI::add(){
    std::string id, title, author, length, type;
    std::cout << "Insert id: ";
    std::getline(std::cin, id);
    std::cout << "Insert title: ";
    std::getline(std::cin, title);
    std::cout << "Insert author: ";
    std::getline(std::cin, author);
    std::cout << "Insert length: ";
    std::getline(std::cin, length);
    std::cout << "Insert type: ";
    std::getline(std::cin, type);

    this->ctrl.add(Recording{stoi(id), title, author, stod(length), type});
}

void UI::remove(){
    std::string id, title, author, length, type;
    std::cout << "Insert id: ";
    std::getline(std::cin, id);
    std::cout << "Insert title: ";
    std::getline(std::cin, title);
    std::cout << "Insert author: ";
    std::getline(std::cin, author);
    std::cout << "Insert length: ";
    std::getline(std::cin, length);
    std::cout << "Insert type: ";
    std::getline(std::cin, type);

    this->ctrl.remove(Recording{stoi(id), title, author, stod(length), type});
}

void UI::update(){
    std::string id, title, author, length, type, newid, newtitle, newauthor, newlength, newtype;
    std::cout << "Insert id: ";
    std::getline(std::cin, id);
    std::cout << "Insert title: ";
    std::getline(std::cin, title);
    std::cout << "Insert author: ";
    std::getline(std::cin, author);
    std::cout << "Insert length: ";
    std::getline(std::cin, length);
    std::cout << "Insert type: ";
    std::getline(std::cin, type);

    this->ctrl.update(Recording{stoi(id), title, author, stod(length), type});
}

void UI::getAll() {
    vector<Recording> ls = this->ctrl.getAll();
    for (auto i : ls)
        std::cout << "Recording " << i.getType() << " of id: " << i.getId() << " title: " << i.getTitle() << " author: " << i.getAuthor() << " having: " << i.getLength() << " minutes.\n";
}

void UI::size() {
    std::cout << "There are " << this->ctrl.size() << " recordings.\n\n" ;
}

void UI::undo(){
    this->ctrl.undo();
}

void UI::redo(){
    this->ctrl.redo();
}
