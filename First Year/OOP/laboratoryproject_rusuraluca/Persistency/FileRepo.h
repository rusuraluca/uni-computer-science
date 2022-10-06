#pragma once
#include "Repo.h"
#include "../Domain/Recording.h"
#include <string>
#include <fstream>

using std::string;
using std::ifstream;
using std::ofstream;

template <typename TElem>
class FileRepo:public Repo<TElem> {
private:
    string filepath;
    void read();
    void save();

public:
    FileRepo(){};
    FileRepo(const string&);
    void add(const TElem&) override;
    void update(const TElem&) override;
    void remove(const TElem&) override;
    const vector<TElem>& getAll() override;
    int size() override;
    ~FileRepo();
};

template<typename TElem>
FileRepo<TElem>::FileRepo(const string &_filepath):Repo<TElem>(),filepath{_filepath} {
}

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
        throw RepoException("File can't be opened!");

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
        ofs << x;
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
