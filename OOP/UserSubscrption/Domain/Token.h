//
// Created by Raluca on 31.05.2022.
//

#ifndef USERSUBSCRPTION_TOKEN_H
#define USERSUBSCRPTION_TOKEN_H


#include <string>
#include <iostream>

class Token {
private:
    std::string name;
    int cost;

public:
    Token(): name{""}, cost{0} {}
    Token(std::string name, int cost): name{name}, cost{cost} {}
    const int getCost() { return this->cost; }
    void setCost(int cost) { this->cost = cost;}
    std::string toString() {
        std::string ss;
        ss += this->name + " & Cost: " + std::to_string(this->cost) + " | ";
        return ss;
    }
    ~Token(){}
};


#endif //USERSUBSCRPTION_TOKEN_H
