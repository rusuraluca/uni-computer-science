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

/*!
 * \class  Recording.
 * \brief  A recording is characterised by its id, title, auhtor, length and type.
 */
class Recording {
private:
    int id;
    string title;
    string author;
    double length;
    string type;

public:
    /*!
     * Default Constructor.
     * \return nothing
     */
    Recording();
    /*!
     * Constructor with parameters.
     * \param int: the unique id of the recording
     * \param string: the title of the recording
     * \param string: the author of the recording
     * \param double: the length of the recording
     * \param string: the type of the recording
     * \return nothing
     */
    Recording(int, const string&, const string&, double, const string&);

    /*!
     * Copy Constructor.
     * \param Recording: another Recording object
     * \return nothing
     */
    Recording(const Recording&);

    /*!
     * Copy Assignment.
     * \param Recording: another Recording object
     * \return nothing
     */
    Recording& operator=(const Recording&);

    /*!
     * Display method.
     * \param ostream: output stream
     * \return nothing
     */
    void virtual display(ostream&) const;

    /*!
     * Getter for id.
     * \return int: id of recording
     */
    int getId() const;
    /*!
     * Setter for id.
     * \param int: id of recording
     */
    void setId(int);
    /*!
     * Getter for title.
     * \return string: title of recording
     */
    const string& getTitle() const;
    /*!
     * Setter for title.
     * \param string: title of recording
     */
    void setTitle(const string&);
    /*!
     * Getter for author.
     * \return string: author of recording
     */
    const string& getAuthor() const;
    /*!
     * Setter for author.
     * \param string: author of recording
     */
    void setAuthor(const string&);
    /*!
     * Getter for length.
     * \return double: length of recording
     */
    double getLength() const;
    /*!
     * Setter for length.
     * \param double: length of recording
     */
    void setLength(double);
    /*!
     * Getter for type.
     * \return string: type of recording
     */
    const string& getType() const;
    /*!
     * Setter for type.
     * \param string: type of recording
     */
    void setType(const string&);

    static std::vector<std::string> tokenize(std::string, char);

    /*!
     * Overloading the >> operator.
     * \param istream : the input stream
     * \param Recording : the recording
     * \return the input stream
     */
    friend istream& operator>>(istream&, Recording&);

    /*!
	 * Overloading the << operator.
	 * \param ostream : the output stream
	 * \param Recording : the recording
	 * \return the output stream
	 */
    friend ostream& operator<<(ostream&, const Recording&);

    /*!
     * Overloading the == operator.
     * \param Recording : other recording
     * \return  true, if their id is equal
     *          false, otherwise
     */
    bool operator==(const Recording&) const;

    /*!
     * Destructor.
     * \return nothing
     */
    ~Recording();

    friend class ValidatorRecording;
};

/*!
 * \class  ValidatorRecording.
 * \brief  Vaildates Recording exceptions.
 */
class ValidatorRecording {
public:
    /*!
     * Validator Method.
     * \return nothing
     * \throw ValidatorException: if data introduced isn't correct
     */
    static void validateRecording(const Recording&);
};
