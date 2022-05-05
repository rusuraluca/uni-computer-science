#include "Matrix.h"
#include <exception>
using namespace std;

// Complexity of the algorithm: Θ(1)
Matrix::Matrix(int nrLines, int nrColumns) {
    // Throws an exception if nrLines or nrColumns is negative or zero
    if(nrLines <= 0 || nrColumns <= 0)
        throw std::exception();

    // Assign the number of lines
    this->nrOfLines = nrLines;
    // Assign the number of columns
    this->nrOfColumns = nrColumns;
    // Pointer to the head of the DLL (initially pointing to NIL)
    this->head = nullptr;
    // Pointer to the tail of the DLL (initially pointing to NIL)
    this->tail = nullptr;
}

// Complexity of the algorithm: Θ(1)
int Matrix::nrLines() const {
    // Returns the number of lines
	return this->nrOfLines;
}

// Complexity of the algorithm: Θ(1)
int Matrix::nrColumns() const {
    // Returns the number of columns
    return this->nrOfColumns;
}

// Complexity of the algorithm
    // BC:      Θ(1)
    //          - if the element at (i, j) is the head node of the DLL
    //          - if the element at (i, j) is the tail node of the DLL

    // WC:      Θ(n), n is the number of non-zero elements in the DLL
    //          - if the element at (i, j) is the second to last node of the DLL

    // AC:      Θ(n), n is the number of non-zero elements in the DLL

    // TOTAL:   O(n), n is the number of non-zero elements in the DLL
TElem Matrix::element(int i, int j) const {
    // Throws an exception if the positions i or j are out of the bounds of the matrix
    if(0 > i || i >= this->nrOfLines)
        throw std::exception();
    if(0 > j || j >= this->nrOfColumns)
        throw std::exception();

    // If the DLL is empty
    if(this->head == nullptr)
        return NULL_TELEM;

    // If the DLL is NOT empty

    // If the element is the Tail node
    if(this->tail->line == i && this->tail->column == j)
        return this->tail->value;

    // If the element is the Head node or other node

    // Store head Node
    Node* temp = this->head;

    // Traverse the doubly linked list
    // To optimise the search:
    // We stop
    // if the next node is nullptr, means we reached the end,
    // or
    // if the current line is bigger than the line we are searching
    // or
    // if the current line is equal to the line we are searching
    // and the current column is bigger than the column we are searching
    while (temp->next != nullptr && (temp->line < i || (temp->line == i && temp->column < j))) {

        // Update temp
        temp = temp->next;
    }

    // If the element is not present in the doubly linked list
    // then temp line and column are different from the ones we are searching so
    // return NULL_TELEM
    if (temp->line != i || temp->column != j)
        return NULL_TELEM;

    // Otherwise, the element is present in the doubly linked list of the sparse matrix
    // return its value
    return temp->value;
}

// Complexity of the algorithm:
// CASE 1:  DO NOTHING
    // BC:      Θ(1)
    //          - if the DLL list is Empty
    // WC:      Θ(n), n is the number of non-zero elements in the DLL
    //          - if the DLL list is not Empty
    // AC:      Θ(n), n is the number of non-zero elements in the DLL
    // TOTAL:   O(n), n is the number of non-zero elements in the DLL

// CASE 2:  INSERT
    // BC:      Θ(1)
    //          -  If we insert before the head node
    //          -  If we insert after the tail node
    // WC:      Θ(n), n is the number of non-zero elements in the DLL
    //          -  If we insert before the tail node
    // AC:      Θ(n), n is the number of non-zero elements in the DLL
    // TOTAL:   O(n), n is the number of non-zero elements in the DLL

// CASE 3:  REMOVE
    // BC:      Θ(1)
    //          -  If we delete the head node
    //          -  If we delete the tail node
    // WC:      Θ(n), n is the number of non-zero elements in the DLL
    //          -  If we delete before the tail node
    // AC:      Θ(n), n is the number of non-zero elements in the DLL
    // TOTAL:   O(n), n is the number of non-zero elements in the DLL

// CASE 4:  CHANGE VALUE
    // BC:      Θ(1)
    //          -  If we delete the head node
    //          -  If we delete the tail node
    // WC:      Θ(n), n is the number of non-zero elements in the DLL
    //          -  If we delete before the tail node
    // AC:      Θ(n), n is the number of non-zero elements in the DLL
    // TOTAL:   O(n), n is the number of non-zero elements in the DLL


// In the algorithm I also use once the element() method,
// therefore the complexity of the algorithm:
    // BC:      Θ(1) + Θ(1) ⇒ Θ(1)
    //          kinda surreal
    // WC:      Θ(n) + Θ(n) ⇒ Θ(n), n is the number of non-zero elements in the DLL
    // AC:      Θ(n), n is the number of non-zero elements in the DLL
    // TOTAL:   O(n), n is the number of non-zero elements in the DLL

TElem Matrix::modify(int i, int j, TElem new_value) {
    if(0 > i || i >= nrOfLines)
        throw std::exception();
    else if(0 > j || j >= nrOfColumns)
        throw std::exception();

    // For the modify operation we have four different cases,
    // based on the value of the element currently at the given position (current_value)
    // and the new value that we want to put on that position (new_value).

    // Keep the previous value
    TElem current_value = element(i, j);

    // Case 1: current value = 0 and new value = 0
    // ⇒ do nothing
    if (current_value == NULL_TELEM && new_value == NULL_TELEM)
        return NULL_TELEM;

    // Case 2: current value = 0 and new_value != 0
    // ⇒ insert in the DLL
    if (current_value == NULL_TELEM && new_value != NULL_TELEM) {

        // Allocate memory for the new Node
        Node* newNode = new Node();

        // Put in the data
        newNode->line = i;
        newNode->column = j;
        newNode->value = new_value;

        // 1. If the DLL is empty
        if(this->head == nullptr) {

            // Update links
            newNode->next = nullptr;
            newNode->prev = nullptr;

            // Make head and tail be the newNode
            this->head = newNode;
            this->tail = newNode;

            // Return its previous value
            return current_value;
        }

        // 2. If the DLL is NOT empty

        // 2.1. If we insert before the head
        if(this->head->line > i || (this->head->line == i && this->head->column > j)){

            // Update links
            newNode->next = this->head;
            newNode->prev = nullptr;
            this->head->prev = newNode;
            this->head = newNode;

            // Return its previous value
            return current_value;
        }

        // 2.2. If we insert after the tail
        if(this->tail->line < i || (this->tail->line == i && this->tail->column < j)){

            // Update links
            newNode->prev = this->tail;
            newNode->next = nullptr;
            this->tail->next = newNode;
            this->tail = newNode;

            // Return its previous value
            return current_value;
        }

        // 2.3. If we insert inside the list

        // We store in temp the head Node
        Node* temp = this->head;

        // Traverse the doubly linked list
        while (temp->next != nullptr && (temp->line < i || (temp->line == i && temp->column < j))) {

            // Update temp
            temp = temp->next;
        }

        // Update links
        newNode->next = temp;
        newNode->prev = temp->prev;
        temp->prev = newNode;
        newNode->prev->next = newNode;

        // Return its previous value
        return current_value;
    }

    // Case 3: current value != 0 and new value = 0
    // ⇒ remove from the DLL
    if (current_value != NULL_TELEM && new_value == NULL_TELEM) {

        // 1. If DLL has only 1 element
        if (this->head == this->tail) {

            // Update links
            this->head = nullptr;
            this->tail = nullptr;

            // Return its previous value
            return current_value;
        }

        // Get node to be deleted

        // We store in temp the head Node
        Node* temp = this->head;

        // Traverse the doubly linked list
        while (temp != nullptr && (temp->line < i || (temp->line == i && temp->column < j))) {

            // Update temp
            temp = temp->next;
        }

        // If node to be deleted is head
        if (temp == this->head) {

            this->head = this->head->next;


            free(temp);
            this->head->prev = nullptr;
            // Return its previous value
            return current_value;
        }

        // If node to be deleted is tail
        if (temp == nullptr) {

            this->tail = this->tail->prev;


            free(this->tail->next);
            this->tail->next = nullptr;

            // Return its previous value
            return current_value;
        }

        // If node to be deleted is inside DLL
        temp->next->prev = temp->prev;
        temp->prev->next = temp->next;

        free(temp);

        // Return its previous value
        return current_value;
    }

    // Case 4: current value != 0 and new value != 0
    // ⇒ just change the value in the data structure
    if (current_value != NULL_TELEM && new_value != NULL_TELEM) {

        // If the element is the Tail node
        if(this->tail->line == i && this->tail->column == j) {
            this->tail->value = new_value;
            return current_value;
        }

        // Store head Node
        Node* temp = this->head;

        // Traverse the doubly linked list
        while (temp->next != nullptr && (temp->line < i || (temp->line == i && temp->column < j))) {

            // Update temp
            temp = temp->next;
        }

        // We reached our node
        // Update its value
        temp->value = new_value;

        // Return its previous value
        return current_value;
    }
}

