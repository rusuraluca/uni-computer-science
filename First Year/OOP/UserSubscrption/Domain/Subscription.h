//
// Created by Raluca on 31.05.2022.
//

#ifndef USERSUBSCRPTION_SUBSCRIPTION_H
#define USERSUBSCRPTION_SUBSCRIPTION_H


#include "Token.h"
#include <vector>

class Subscription {
private:
    int id;
    std::string startDate;

public:
    Subscription():id{-1}, startDate{""}{}
    Subscription(int id, std::string startDate): id{id}, startDate{startDate}{}
    int getId() const { return this->id; }
    void setId(int id) { this->id = id; }
    std::string getStartDate() const { return this->startDate; }
    void setStartDate(std::string startDate) { this->startDate = startDate; }
    virtual std::string toString() = 0;
    virtual void discount(int k) = 0;
    ~Subscription(){}
};

class MonthlySubscription:public Subscription{
private:
    std::string payDate;
    int amount;
public:
    MonthlySubscription(): Subscription(), payDate{""}, amount{0}{}
    MonthlySubscription(int id, std::string startDate, std::string payDate, int amount):
        Subscription(id, startDate), payDate{payDate}, amount{amount}{}

    std::string toString(){
        std::string ss;
        ss += "Type: Monthly Subscription | Date: " + this->getStartDate() + " | Amount: " + std::to_string(this->amount);
        return ss;
    }
    void discount(int k){
        this->amount = this->amount - (this->amount % k);
    }
    ~MonthlySubscription(){}
};


class FreemiumSubscription:public Subscription{
private:
    std::vector<Token*> tokens;

public:
    FreemiumSubscription(int id, std::string startDate, std::vector<Token*> tokens):
            Subscription(id, startDate), tokens{tokens} {}

    std::string toString(){
        std::string ss;
        ss = ss + "Type: Freemium Subscription | Date: " + this->getStartDate() + " | Tokens: ";
        for(auto token : this->tokens)
            ss += token->toString();
        return ss;
    }

    void discount(int k){
        std::vector<Token*> newtokens;
        for(auto token : tokens){
            token->setCost(token->getCost() - (token->getCost() % k));
            newtokens.push_back(token);
        }
        this->tokens.clear();
        this->tokens = newtokens;
    }

    ~FreemiumSubscription(){}
};


#endif //USERSUBSCRPTION_SUBSCRIPTION_H
