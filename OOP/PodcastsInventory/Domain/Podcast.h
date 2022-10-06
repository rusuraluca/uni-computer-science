//
// Created by Raluca on 08.05.2022.
//
#pragma once
#include "Recording.h"

/*!
 * \class  Podcast.
 * \brief  A podcast is a recording with a maximum speed limit.
 */
class Podcast:public Recording {
private:
    int maxSpeed;

public:
    /*!
	 * Default constructor.
	 *
	 * \return nothing
	 */
    Podcast();

    /*!
     * Constructor with parameters.
     * \param int: the unique id of the recording (inherited)
     * \param string: the title of the recording (inherited)
     * \param string: the author of the recording (inherited)
     * \param double: the length of the recording (inherited)
     * \param string: the type of the recording (inherited)
     * \param int: the max speed of the recording
     * \return nothing
     */
    Podcast(int, const string&, const string&, double, const string&, int);

    /*!
     * Copy Constructor.
     * \param Podcast: another Podcast object
     * \return nothing
     */
    Podcast(const Podcast&);

    /*!
     * Display method.
     * \param ostream: output stream
     * \return nothing
     */
    void display(ostream& os) const override;

    /*!
     * Getter for maxSpeed.
     * \return int: maxSpeed of podcast
     */
    int getMaxSpeed() const;
    /*!
     * Setter for maxSpeed.
     * \param int: maxSpeed of podcast
     */
    void setMaxSpeed(int);

    /*!
     * Overloading the >> operator.
     * \param istream : the input stream
     * \param Podcast : the podcast
     * \return the input stream
     */
    friend istream& operator>>(istream&, Podcast&);

    /*!
	 * Overloading the << operator.
	 * \param ostream : the output stream
	 * \param Podcast : the podcast
	 * \return the output stream
	 */
    friend ostream& operator<<(ostream&, const Podcast&);

    /*!
     * Destructor.
     * \return nothing
     */
    ~Podcast();

    friend class ValidatorPodcast;
};

/*!
 * \class  ValidatorPodcast.
 * \brief  Vaildates Podcast exceptions.
 */
class ValidatorPodcast {
public:
    /*!
     * Validator Method.
     * \return nothing
     * \throw ValidatorException: if data introduced isn't correct
     */
    static void validatePodcast(const Podcast&);
};
