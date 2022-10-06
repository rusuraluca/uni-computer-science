//
// Created by Raluca on 07.05.2022.
//
#pragma once
#include "../Persistency/FileRepo.h"
#include <stack>

enum class ActionType {
    ADD,
    REMOVE
};
template <typename TElem>

/*!
 * \class  Controller.
 * \brief  This is the controller.
 */
class Controller{
private:
    FileRepo<TElem> ctrl;
    std::stack<std::pair<ActionType, TElem>> undoStack;
    std::stack<std::pair<ActionType, TElem>> redoStack;

public:
    /*!
	 * Constructor with parameters.
	 * \param repository : the repository we store our objects in
	 * \return nothing
	 */
    Controller(FileRepo<TElem>&);

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
     * Displays all recordings which have the length lower than a given value.
     * \param length : the value we compare the lengths to
     */
    virtual void displayByLengthLowerThan(double);

    /*!
	 * Undo the last action performed.
	 * if the last action was ADD, the recording added will be removed
	 * if the last action was REMOVE, the recording removed will be added back into the repository
	 */
    void undo();

    /**
	 * Redo the last action that was previously undone.
	 * if the action was REMOVE, the recording which was added after the undo() will be removed once again into the repository
	 * if the last action was ADD, the recording which was removed by the undo() will be added once again into the repository
	 */
    void redo();

    /*!
     * Destructor.
     * \return nothing
     */
    ~Controller();
};

template<typename TElem>
Controller<TElem>::Controller(FileRepo<TElem>& repo) {
    this->ctrl = repo;
}

template<typename TElem>
void Controller<TElem>::add(const TElem& elem) {
    ValidatorRecording::validateRecording(elem);
    this->ctrl.add(elem);
    undoStack.push(std::make_pair(ActionType::ADD, elem));
}

template<typename TElem>
void Controller<TElem>::update(const TElem& elem) {
    ValidatorRecording::validateRecording(elem);
    this->ctrl.update(elem);
    undoStack.push(std::make_pair(ActionType::ADD, elem));
}

template<typename TElem>
void Controller<TElem>::remove(const TElem &elem) {
    ValidatorRecording::validateRecording(elem);
    int size = this->ctrl.size();
    this->ctrl.remove(elem);
    if(this->ctrl.size() == size-1){
        undoStack.push(std::make_pair(ActionType::REMOVE, elem));
    }
}

template<typename TElem>
void Controller<TElem>::displayByLengthLowerThan(double length) {
    return this->ctrl.displayByLengthLowerThan(length);
}

template<typename TElem>
const vector<TElem> &Controller<TElem>::getAll() {
    return this->ctrl.getAll();
}

template<typename TElem>
int Controller<TElem>::size() {
    return this->ctrl.size();
}

template<typename TElem>
void Controller<TElem>::undo() {
    /**
     * Possible operations to undo:
     *  1) ADD :
     *      (i)     move the pair (ADD, recording) to the REDO STACK
     *      (ii)    delete it from the UNDO STACK
     *      (iii)   remove recording
     *
     * 2) REMOVE :
     *      (i) move the pair (REMOVE, recording) to the REDO STACK
     *      (ii) delete it from the UNDO STACK
     *      (iii) add recording.
     */
    /// ADD:
    if (this->undoStack.top().first == ActionType::ADD) {
        /// (i)
        this->redoStack.push(std::make_pair(ActionType::ADD, this->undoStack.top().second));
        /// (ii)
        this->undoStack.pop();
        /// (iii)
        this->ctrl.remove(this->redoStack.top().second);
    }
    /// REMOVE:
    if (this->undoStack.top().first == ActionType::REMOVE) {
        /// (i)
        this->redoStack.push(std::make_pair(ActionType::REMOVE, this->undoStack.top().second));
        /// (ii)
        this->undoStack.pop();
        /// (iii)
        this->ctrl.add(this->redoStack.top().second);
    }
}

template<typename TElem>
void Controller<TElem>::redo() {
    /*!
     * Possible operations to redo:
	 * 1) ADD:
	 *      (i)     move the pair (ADD, recording) to the UNDO STACK
	 *      (ii)    delete it from the REDO STACK
	 *      (iii)   add recording
	 *
	 * 2) REMOVE :
	 *      (i)     move the pair (REMOVE, recording) to the UNDO STACK
	 *      (ii)    delete it from the REDO STACK
	 *      (iii)   remove recording.
     */
    /// ADD:
    if (this->redoStack.top().first == ActionType::ADD) {
        /// (i)
        this->undoStack.push(std::make_pair(ActionType::ADD, this->redoStack.top().second));
        /// (ii)
        this->redoStack.pop();
        /// (iii)
        this->ctrl.add(this->undoStack.top().second);
    }
    /// REMOVE:
    if (this->redoStack.top().first == ActionType::REMOVE) {
        /// (i)
        this->undoStack.push(std::make_pair(ActionType::REMOVE, this->redoStack.top().second));
        /// (ii)
        this->redoStack.pop();
        /// (iii)
        this->ctrl.remove(this->undoStack.top().second);
    }
}

template<typename TElem>
Controller<TElem>::~Controller() {}