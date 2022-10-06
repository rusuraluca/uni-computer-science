#pragma once

//DO NOT CHANGE THIS PART
typedef int TElem;
#define NULL_TELEM 0

/*
 ======================================================================================================
| @Author: Raluca-Maria Rusu, group 813, Mathematics and Computer Science                                    |
| **************************************************************************************************** |
| ADT Matrix represented as a sparse matrix,                                                           |
| using a dynamically allocated DLL with <line, column, value> triples (value ≠ 0),                    |
| ordered lexicographically considering the line and column of every element                           |                                                                 |
| **************************************************************************************************** |
| Methods:                                                                                             |
|     - nrLines (returns the number of lines of the matrix)                                            |
|     - nrColumns (returns the number of columns of the matrix)                                        |
|     - element (returns the element from line i and column j)                                         |
|     - modify (modifies the value from line i and column j in the DLL)                                |
|                                                                                                      |
 ======================================================================================================
                         .
                        / V\
                      / `  /
                     <<   |
                     /    |
                   /      |
                 /        |
               /    \  \ /
              (      ) | |
      ________|   _/_  | |
    <__________\______)\__)
*/

class Matrix {

private:
    // Node of the DLL
    struct Node {
        // The position of the node
        int line, column;
        // Value of the node
        TElem value;
        // Pointer to next node in DLL
        Node *next;
        // Pointer to prev node in DLL
        Node *prev;
    };

    // The number of Lines, respectively Columns, of the Sparse Matrix
    int nrOfLines, nrOfColumns;
    // A pointer to the node Head of the DLL of the Sparse Matrix
    Node * head;
    // A pointer to the node Tail of the DLL of the Sparse Matrix
    Node * tail;

public:
    /*
        DESCRIPTION:    creates a matrix, given the number of lines and columns
        @PRE: 	        nrLines ∈ N^* and nrColumns ∈ N^*
        @POST: 	        mat ∈ MAT, mat is a matrix with nrOfLines lines, nrOfColumns column,
                        a pointer to the head of the DLL (initially pointing to NIL)
                        and a pointer to the tail of the DLL (initially pointing to NIL)
        THROWS:         an exception if nrOfLines or nrOfColumns is negative or zero
    */
	Matrix(int nrLines, int nrCols);

    /*
        DESCRIPTION:    returns the number of lines of the matrix
        @PRE: 	        mat ∈ MAT
        @POST: 	        nrOfLines ← returns the number of lines from matrix
    */
	int nrLines() const;

    /*
        DESCRIPTION:    returns the number of columns of the matrix
        @PRE: 	        mat ∈ MAT
        @POST: 	        nrOfColumns ← returns the number of columns from matrix
    */
    int nrColumns() const;

    /*
        DESCRIPTION:    returns the value of the non-zero element from line i and column j (indexing starts from 0)
        @PRE: 	        mat ∈ MAT, 1 ≤ i ≤ nrOfLines, 1 ≤ j ≤ nrOfColumns
        @POST: 	        element ← the element from line i and column j
        THROWS:         an exception if (i,j) is not a valid position in the Matrix
                        (less than 1 or greater than nrOfLines / nrOfColumns)
    */
	TElem element(int i, int j) const;

    /*
        DESCRIPTION:    modifies the value at line i and column j
                        returns the previous value from the position
        @PRE: 	        mat ∈ MAT, 1 ≤ i ≤ nrOfLines, 1 ≤ j ≤ nrOfColumns, val ∈ TElem
        @POST: 	        the value from position (i, j) is set to val
                        modify ← the old value from position (i, j)
        THROWS:         throws exception if (i,j) is not a valid position in the Matrix
                        (less than 1 or greater than nrOfLines / nrOfColumns)
    */
	TElem modify(int i, int j, TElem e);
};