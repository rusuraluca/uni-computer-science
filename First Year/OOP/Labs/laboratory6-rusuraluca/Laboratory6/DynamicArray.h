#pragma once
#include "Offer.h"
#include <string>
#include <ostream>
using namespace std;

typedef Offer ElementType;

class DynamicArray{
public:
	DynamicArray(int capacity = 100); // = default parameter

	// RULE OF THREE
	// destructor
	~DynamicArray();

	// copy constructor
	DynamicArray(const DynamicArray& other);

	// assignment operator
	DynamicArray& operator=(const DynamicArray& other);
	// end RULE OF THREE

	// getter for the length
	// inline - it MUST be implemented in the header
	inline unsigned int getLength() const { return length; }

	inline unsigned int getCapacity() const { return capacity; }

	// adds an element at the end
	void append(ElementType v, bool* err = nullptr);

	// remove the element from the end
	// pre: the array is not empty
	ElementType popBack();

	// remove an element from position i
	// index >= 0 and index < length

	ElementType remove(unsigned int index);

	// get the element on a position
	// a[10]
	// index >= 0 and index < length
	// -1 is returned if the index is not valid
	ElementType& get(unsigned int index);

	// print the array
	friend ostream& operator<<(ostream& s, const DynamicArray& arr);

	// operator+ -> append a value to the array
	// opertaor belongs to the class
	// param v -> get appened at the end of the array
	//DynamicArray& operator+(int v); // operator+ -> is a method of DynamicArray

	// second way - friends (the operator does not belong to the class)
	// friend DynamicArray& operator+(DynamicArray& arr, int v);

private:
	// static -> it belongs to the class
	static int count;
	// Length � how many elements do we have(0)
	unsigned int length;
	//	Capacity � the max number of elements
	unsigned int capacity;
	// data - array itself
	ElementType* data;

	void resize(unsigned int newCapacity);
};

