#pragma once
#include <vector>
#include <algorithm>
#include "../Exceptions/Exceptions.h"

using std::vector;
template <typename TElem>

class Repo {
protected:
    vector<TElem> elems;

public:
    Repo();
    virtual void add(const TElem&);
    virtual void update(const TElem&);
    virtual void remove(const TElem&);
    virtual const vector<TElem>& getAll();
    virtual int size();
    ~Repo();
};

template<typename TElem>
Repo<TElem>::Repo() {
}

template<typename TElem>
void Repo<TElem>::add(const TElem &elem) {
    auto it = std::find(this->elems.begin(), this->elems.end(), elem);
    if (it != this->elems.end()){
        throw RepoException("Existing element!\n");
    }
    this->elems.push_back(elem);
}

template<typename TElem>
void Repo<TElem>::update(const TElem& elem) {
    auto it = std::find(this->elems.begin(), this->elems.end(), elem);
    if (it == this->elems.end()){
        throw RepoException("Non-existent element!\n");
    }
    this->elems[it-this->elems.begin()] = elem;
}

template<typename TElem>
void Repo<TElem>::remove(const TElem& elem) {
    auto it = std::find(this->elems.begin(), this->elems.end(), elem);
    if (it == this->elems.end()){
        throw RepoException("Non-existent element!\n");
    }
    this->elems.erase(it);
}

template<typename TElem>
const vector<TElem> &Repo<TElem>::getAll() {
    return this->elems;
}

template<typename TElem>
int Repo<TElem>::size() {
    return this->elems.size();
}

template<typename TElem>
Repo<TElem>::~Repo() {
}
