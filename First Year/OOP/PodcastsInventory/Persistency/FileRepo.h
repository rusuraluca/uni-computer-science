#pragma once
#include "Repo.h"
#include "../Domain/Recording.h"
#include <string>
#include <fstream>

using std::string;
using std::ifstream;
using std::ofstream;
template <typename TElem>

/*!
 * \class  FileRepo.
 * \brief  This is a type of recording repository which gets data from a csv file.
 */
class FileRepo:public Repo<TElem> {
private:
    string filepath;
    /*!
	 * Reads the data from the .csv file where the recordings are stored.
	 */
    void read();

    /*!
     * Saves the data to the .csv file where the recordings are stored.
     */
    void save();

public:
    /*!
     * Default Constructor.
     * \return nothing
     */
    FileRepo(){};

    /*!
     * Constructor with parameters.
     * \param string : the path to the csv file
     * \return nothing
     */
    FileRepo(const string&);

    /*!
     * Add a recording to the repository.
     * \param TElem : the element we want to add to the repository
     */
    void add(const TElem&) override;

    /*!
     * Remove a recording to the repository.
     * \param TElem : the element we want to remove to the repository
     */
    void remove(const TElem&) override;

    /*!
     * Update a recording in the repository.
     * \param TElem : the element we want to update in the repository
     */
    void update(const TElem&) override;

    /*!
     * Get method - gets all repo recordings.
     * \return all repo recordings
     */
    const vector<TElem>& getAll() override;

    /*!
     * Computes the size of the repository.
     * \return the number of recordings in the repository
     */
    int size() override;

    /*!
     * Displays all recordings which have the length lower than a given value.
     * \param length : the value we compare the lengths to
     */
    void displayByLengthLowerThan(double);

    /*!
     * Destructor.
     * \return nothing
     */
    ~FileRepo();
};

template<typename TElem>
FileRepo<TElem>::FileRepo(const string &_filepath):Repo<TElem>(),filepath{_filepath} {}

template<typename TElem>
void FileRepo<TElem>::add(const TElem &elem) {
    this->read();
    Repo<TElem>::add(elem);
    this->save();
}

template<typename TElem>
void FileRepo<TElem>::read() {
    ifstream ifs{this->filepath};
    this->elems.clear();

    if (!ifs.is_open())
        throw FileException("File can't be opened!\n");

    TElem r;
    while(ifs >> r){
        this->elems.push_back(r);
    }

    ifs.close();
}

template<typename TElem>
void FileRepo<TElem>::save() {
    ofstream ofs{this->filepath};

    std::for_each(this->elems.begin(),this->elems.end(),[&](const auto& x){
        ofs << x << endl;
    });

    ofs.close();
}

template<typename TElem>
void FileRepo<TElem>::update(const TElem &elem) {
    this->read();
    Repo<TElem>::update(elem);
    this->save();
}

template<typename TElem>
void FileRepo<TElem>::remove(const TElem &elem) {
    this->read();
    Repo<TElem>::remove(elem);
    this->save();
}

template<typename TElem>
void FileRepo<TElem>::displayByLengthLowerThan(double length) {
    this->read();
    Repo<TElem>::displayByLengthLowerThan(length);
}


template<typename TElem>
const vector<TElem> &FileRepo<TElem>::getAll() {
    this->read();
    return Repo<TElem>::getAll();
}

template<typename TElem>
int FileRepo<TElem>::size() {
    this->read();
    return Repo<TElem>::size();
}

template<typename TElem>
FileRepo<TElem>::~FileRepo() {}
