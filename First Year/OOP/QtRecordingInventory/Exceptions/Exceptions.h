#pragma once
#include <string>
using namespace std;

/*!
 * \class  FileException.
 * \brief  This is the handler for file reading/saving exceptions.
 */
class FileException {
private:
    string msg;

public:
    /*!
     * Constructor with parameters.
     * \param string : the message of the exception
     * \return nothing
     */
    FileException(const string& msg) :msg{ msg } {}

    /*!
     * Getter for the message.
     * \return string: message of recording
     */
    const string& getMsg() const;
};

/*!
 * \class  ValidationException.
 * \brief  This is the handler for validation exceptions.
 */
class ValidationException {
private:
    string msg;

public:
    /*!
     * Constructor with parameters.
     * \param string : the message of the exception
     * \return nothing
     */
    ValidationException(const string& msg) :msg{ msg } {}

    /*!
     * Getter for the message.
     * \return string: message of recording
     */
    const string& getMsg() const;
};

/*!
 * \class  RepoException.
 * \brief  This is the handler for repository-related exceptions.
 */
class RepoException {
private:
    string msg;

public:
    /*!
     * Constructor with parameters.
     * \param string : the message of the exception
     * \return nothing
     */
    RepoException(const string& msg) :msg{ msg } {}

    /*!
     * Getter for the message.
     * \return string: message of recording
     */
    const string& getMsg() const;
};
