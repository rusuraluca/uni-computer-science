#include "Recording.h"

Recording::Recording():
    id{0}, title{""}, author{""}, length{0.0}, type{""}{}

Recording::Recording(int _id, const string& _title, const string& _author, double _length, const string& _type):
    id{_id}, title{_title}, author{_author}, length{_length}, type{_type} {}

Recording::Recording(const Recording& other):
        id{other.id}, title{other.title}, author{other.author}, length{other.length}, type{other.type}{}

Recording &Recording::operator=(const Recording& other) {
    this->id = other.id;
    this->title = other.title;
    this->author = other.author;
    this->length = other.length;
    this->type = other.type;
    return *this;
}

int Recording::getId() const {
    return this->id;
}
void Recording::setId(int _id) {
    this->id = _id;
}

const string& Recording::getTitle() const {
    return this->title;
}
void Recording::setTitle(const string& _title) {
    this->title = _title;
}

const string& Recording::getAuthor() const {
    return this->author;
}
void Recording::setAuthor(const string& _author) {
    this->author = _author;
}

double Recording::getLength() const {
    return this->length;
}
void Recording::setLength(double _length) {
    this->length = _length;
}

const string& Recording::getType() const {
    return this->type;
}
void Recording::setType(const string& _type) {
    this->type = _type;
}

void Recording::display(ostream& os) const{
    os << id << ","
       << title << ","
       << author << ","
       << length << ","
       << type;
}

std::vector<std::string> Recording::tokenize(std::string str, char delimiter){
    std::vector<std::string> result;
    std::stringstream ss(str);
    std::string token;
    while (getline(ss, token, delimiter))
        result.push_back(token);

    return result;
}

std::istream& operator>>(std::istream& is, Recording& recording) {
    std::string line;
    getline(is, line);

    std::vector<std::string> tokens = recording.tokenize(line, ',');
    if (tokens.size() != 5) // make sure the data we have is ok
        return is;

    int id;
    std::istringstream(tokens[0]) >> id;
    recording.id = id;

    recording.title = tokens[1];
    recording.author = tokens[2];

    double length;
    std::istringstream(tokens[3]) >> length;
    recording.length = length;

    recording.type = tokens[4];

    return is;
}

ostream &operator<<(ostream& os, const Recording& recording) {
    recording.display(os);
    return os;
}

bool Recording::operator==(const Recording& recording) const {
    return this->id == recording.id;
}

Recording::~Recording() {}

void ValidatorRecording::validateRecording(const Recording& recording){
    string errorMsg = "";
    if (recording.id <= 0)
        errorMsg += "Incorrect id!\n";
    if (recording.title == "")
        errorMsg += "Title cannot be empty!\n";
    if (recording.author == "")
        errorMsg += "Author cannot be empty!\n";
    if (recording.length <= 0.0)
        errorMsg += "Length cannot be empty or negative!\n";
    if (recording.type == "" && (recording.type != "video" || recording.type != "audio"))
        errorMsg += "Recording type cannot be empty: is either video or audio!\n";
    if (errorMsg.size() > 0)
        throw ValidationException{ errorMsg };
}
