//
// Created by Raluca on 08.05.2022.
//
#pragma once
#include "Recording.h"

/*!
 * \class  Vlog.
 * \brief  A vlog is a recording with a certain quality of video.
 */
class Vlog:public Recording {
private:
    int quality;

public:
    /*!
    * Default constructor.
    *
    * \return nothing
    */
    Vlog();

    /*!
     * Constructor with parameters.
     * \param int: the unique id of the recording (inherited)
     * \param string: the title of the recording (inherited)
     * \param string: the author of the recording (inherited)
     * \param double: the length of the recording (inherited)
     * \param string: the type of the recording (inherited)
     * \param int: the quality of the recording
     * \return nothing
     */
    Vlog(int, const string&, const string&, double, const string&, int);

    /*!
     * Copy Constructor.
     * \param Vlog: another Vlog object
     * \return nothing
     */
    Vlog(const Vlog&);

    /*!
     * Display method.
     * \param ostream: output stream
     * \return nothing
     */
    void display(ostream& os) const override;

    /*!
     * Getter for quality.
     * \return int: quality of podcast
     */
    int getQuality() const;
    /*!
     * Setter for quality.
     * \param int: quality of podcast
     */
    void setQuality(int);

    /*!
     * Overloading the >> operator.
     * \param istream : the input stream
     * \param Vlog : the vlog
     * \return the input stream
     */
    friend istream& operator>>(istream&, Vlog&);

    /*!
     * Overloading the << operator.
     * \param ostream : the output stream
     * \param Vlog : the vlog
     * \return the output stream
     */
    friend ostream& operator<<(ostream&, const Vlog&);

    /*!
     * Destructor.
     * \return nothing
     */
    ~Vlog();

    friend class ValidatorVlog;
};

/*!
 * \class  ValidatorVlog.
 * \brief  Vaildates Vlog exceptions.
 */
class ValidatorVlog {
public:
    /*!
     * Validator Method.
     * \return nothing
     * \throw ValidatorException: if data introduced isn't correct
     */
    static void validateVlog(const Vlog&);
};
