//
// Created by Raluca on 31.05.2022.
//

#ifndef USERSUBSCRPTION_REPO_H
#define USERSUBSCRPTION_REPO_H


#include "../Domain/Subscription.h"

class Repo {
private:
    std::vector<Subscription*> users;

public:
    Repo(std::vector<Subscription*> arr): users{arr}{}

    std::vector<Subscription*> getAll(){ return users; }

    void discount(int k){
        for(auto user : users)
            user->discount(k);
    }

    void discountId(int id, int k){
        for(auto user : users)
            if(user->getId() == id)
                user->discount(k);
    }

    ~Repo(){}
};


#endif //USERSUBSCRPTION_REPO_H
