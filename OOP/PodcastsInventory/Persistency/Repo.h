#pragma once
#include <iostream>
#include <vector>
#include <algorithm>
#include "../Domain/Podcast.h"
#include "../Domain/Vlog.h"
#include "../Exceptions/Exceptions.h"

using std::vector;
template <typename TElem>

/*!
 * \class  Repo.
 * \brief  This is the recording repository.
 */
class Repo {
protected:
    vector<TElem> elems;
public:
    /*!
     * Default Constructor.
     * \return nothing
     */
    Repo();

    /*!
     * Add a recording to the repository.
     * \param TElem : the element we want to add to the repository
     */
    virtual void add(const TElem&);

    /*!
     * Remove a recording to the repository.
     * \param TElem : the element we want to remove to the repository
     */
    virtual void remove(const TElem&);

    /*!
     * Update a recording in the repository.
     * \param TElem : the element we want to update in the repository
     */
    virtual void update(const TElem&);

    /*!
     * Get method - gets all repo recordings.
     * \return all repo recordings
     */
    virtual const vector<TElem>& getAll();

    /*!
     * Computes the size of the repository.
     * \return the number of recordings in the repository
     */
    virtual int size();

    /*!
     * Display method - displays repo recordings based on a property.
     * \param os : the ostream operator we will use to display the recording oject
     * \param function : the property the recording shall fulfill in order to be eligible for display
     * \return the recording in the way described in the function
     */
    ostream& display(ostream& os, bool (*function)(TElem));

    /*!
     * Displays all recordings which have the length lower than a given value.
     * \param length : the value we compare the lengths to
     */
    void displayByLengthLowerThan(double);

    /*!
     * Destructor.
     * \return nothing
     */
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

template<typename TElem>
ostream &Repo<TElem>::display(ostream &os, bool (*function)(TElem)) {
    for (auto i = 0; i < elems.size(); i++) {
        if (function(elems[i])) {
            os << elems[i];
        }
    }
    return os;
}

template<typename TElem>
void Repo<TElem>::displayByLengthLowerThan(double length) {
    int k = 0;
    for (size_t i = 0; i < elems.size(); i++) {
        if (elems[i].getLength() < length) {
            elems[i].display(std::cout);
            k++;
            std::cout << std::endl;
        }
    }
    if (k == 0)
        throw RepoException("There were no such recordings!\n");

}

