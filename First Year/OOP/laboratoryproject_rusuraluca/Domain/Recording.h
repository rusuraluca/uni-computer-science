#pragma once
#include "../Exceptions/Exceptions.h"
#include <iostream>
#include <ostream>
#include <istream>
#include <iomanip>
#include <cctype>
#include <vector>
#include <map>
#include <sstream>
#include <string>

using std::string;
using std::ostream;
using std::istream;

class Recording {
private:
    int id;
    string title;
    string author;
    double length;
    string type;

public:
    Recording();
    Recording(int, const string&, const string&, double, const string&);
    Recording(const Recording&);
    Recording& operator=(const Recording&);

    int getId() const;
    void setId(int);
    const string& getTitle() const;
    void setTitle(const string&);
    const string& getAuthor() const;
    void setAuthor(const string&);
    double getLength() const;
    void setLength(double);
    const string& getType() const;
    void setType(const string&);

    friend ostream& operator<<(ostream&,const Recording&);
    friend istream& operator>>(istream&,Recording&);

    bool operator==(const Recording&) const;
    ~Recording();

    friend class ValidatorRecording;
};

class ValidatorRecording {
public:
    static void validateRecording(const Recording& recording);
};
