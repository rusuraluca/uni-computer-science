//
// Created by Raluca on 08.05.2022.
//
//
// Created by Raluca on 08.05.2022.
//
#include "Podcast.h"

Podcast::Podcast(): Recording(), maxSpeed{0}{}

Podcast::Podcast(int _id, const string& _title, const string& _author, double _length, const string& _type, int _maxSpeed):
        Recording(_id,_title, _author, _length, _type), maxSpeed{_maxSpeed}{}

Podcast::Podcast(const Podcast& other): Recording(other), maxSpeed{other.maxSpeed} {}

int Podcast::getMaxSpeed() const{
    return this->maxSpeed;
}
void Podcast::setMaxSpeed(int _maxSpeed){
    this->maxSpeed= _maxSpeed;
}

void Podcast::display(ostream& os) const{
    Recording::display(os);
    os << "," << maxSpeed;
}

std::istream& operator>>(std::istream& is, Podcast& podcast) {
    std::string line;
    getline(is, line);

    std::vector<std::string> tokens = Recording::tokenize(line, ',');
    if (tokens.size() != 6) // make sure the data we have is ok
        return is;

    int id;
    std::istringstream(tokens[0]) >> id;
    podcast.setId(id);

    podcast.setTitle(tokens[1]);
    podcast.setAuthor(tokens[2]);

    double length;
    std::istringstream(tokens[3]) >> length;
    podcast.setLength(length);

    podcast.setType(tokens[4]);

    int maxSpeed;
    std::istringstream(tokens[5]) >> maxSpeed;
    podcast.setMaxSpeed(maxSpeed);

    return is;
}

ostream &operator<<(ostream& os, const Podcast& podcast) {
    podcast.display(os);
    return os;
}

Podcast::~Podcast(){}

void ValidatorPodcast::validatePodcast(const Podcast& podcast){
    string errorMsg = "";
    ValidatorRecording::validateRecording(podcast);
    if (podcast.maxSpeed <= 0 || podcast.maxSpeed >= 4)
        errorMsg += "Incorrect maximum speed: chose between 1,2 or 3!\n";
    if (errorMsg.size() > 0)
        throw ValidationException{ errorMsg };
}


