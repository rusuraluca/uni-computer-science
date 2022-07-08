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
class Controller{
private:
    FileRepo<TElem> ctrl;
    std::stack<std::pair<ActionType, TElem>> undoStack;
    std::stack<std::pair<ActionType, TElem>> redoStack;

public:
    Controller(FileRepo<TElem>&);
    virtual void add(const TElem&);
    virtual void update(const TElem&);
    virtual void remove(const TElem&);
    virtual const vector<TElem>& getAll();
    virtual int size();

    void undo();
    void redo();
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
     *  How this wonder works:
     * Possible operations to undo:
     *  1) ADD :
     * (i) move the pair (ADD, instrumentName) to the REDO STACK
     * (ii) delete it from the UNDO STACK
     * (iii) remove instrumentName
     *
     * 2) REMOVE :
     * (i) move the pair (REMOVE, instrumentName) to the REDO STACK
     * (ii) delete it from the UNDO STACK
     * (iii) add instrumentName.
     *
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
Controller<TElem>::~Controller() {
}


