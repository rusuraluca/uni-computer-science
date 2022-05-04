//
// Created by Raluca on 12.04.2022.
//

#ifndef LABORATORY8_RUSURALUCA_DYNAMICARRAY_H
#define LABORATORY8_RUSURALUCA_DYNAMICARRAY_H

#include "../Domain/Offer.h"
#include <string>
#include <iostream>
using namespace std;

template <typename ElementType>

class DynamicArray{
public:
    DynamicArray(int capacity = 100);

    ~DynamicArray();

    DynamicArray(const DynamicArray& other);

    DynamicArray& operator=(const DynamicArray& other);

    inline unsigned int getLength() const { return length; }

    inline unsigned int getCapacity() const { return capacity; }

    void append(ElementType v, bool* err = nullptr);

    ElementType popBack();

    ElementType remove(unsigned int index);

    ElementType& get(unsigned int index);

    template<class DynamicArray> friend ostream& operator<<(ostream& s, const DynamicArray& arr);

private:
    static int count;
    unsigned int length;
    unsigned int capacity;
    ElementType* data;

    void resize(unsigned int newCapacity);
};


template<typename ElementType>
DynamicArray<ElementType>::DynamicArray(int capacity) {
    length = 0;
    this->capacity = capacity;
    data = new ElementType[capacity]();

    if (data == nullptr)
        throw std::overflow_error("Failed to allocate memory: DynamicArray()");
}

template<typename ElementType>
DynamicArray<ElementType>::~DynamicArray() {
    delete[] data;
}

template<typename ElementType>
DynamicArray<ElementType>::DynamicArray(const DynamicArray &other) {
    length = other.length;
    capacity = other.capacity;

    data = new ElementType[other.capacity]();

    if (data == nullptr) {
        throw std::overflow_error("Failed to allocate memory: DynamicArray(const DynamicArray& other)");
    }

    for (unsigned int i = 0; i < length; i++)
        data[i] = other.data[i];

}

template<typename ElementType>
DynamicArray<ElementType> &DynamicArray<ElementType>::operator=(const DynamicArray &other) {
    if (this != &other) {

        length = other.length;
        capacity = other.capacity;

        delete[] this->data;

        data = new ElementType[other.capacity]();

        if (data == nullptr)
            throw std::length_error("Precondition does not hold: popBack()");

        for (unsigned int i = 0; i < length; i++)
            data[i] = other.data[i];
    }
    return *this;
}

template<typename ElementType>
void DynamicArray<ElementType>::append(ElementType v, bool *err) {
    if (length == capacity) {
        // double the capacity
        resize(capacity * 2);
    }
    data[length] = v;
    length++;
}

template<typename ElementType>
ElementType DynamicArray<ElementType>::popBack() {
    if (length == 0) {
        throw std::length_error("Precondition does not hold: popBack()");
    }

    ElementType v = data[length];
    length--;

    return v;
}

template<typename ElementType>
ElementType DynamicArray<ElementType>::remove(unsigned int index) {
    if (index >= 0 && index < length) {
        ElementType v = data[index];
        for (unsigned int i = index; i < length - 1; i++)
            data[i] = data[i + 1];
        length--;
        return v;
    }
    else throw std::length_error("Precondition does not hold: remove()");

}

template<typename ElementType>
ElementType &DynamicArray<ElementType>::get(unsigned int index) {
    if (index >= 0 && index < length) {
        return data[index];
    }
    else throw std::length_error("Precondition does not hold: get()");
}

template<typename ElementType>
void DynamicArray<ElementType>::resize(unsigned int newCapacity) {
    this->capacity = newCapacity;

    ElementType* newData = new ElementType[newCapacity]();
    if (newData == nullptr) {
        throw std::length_error("Failed to allocate memory: resize()");
    }

    for (unsigned int i = 0; i < length; i++) {
        newData[i] = this->data[i];
    }

    delete[] this->data;
    this->data = newData;
}

template<class DynamicArray>
ostream &operator<<(ostream &s, const DynamicArray &arr) {
    for (unsigned int i = 0; i < arr.length; i++) {
        s << arr.data[i] << std::endl;
    }
    return s;
}

#endif //LABORATORY8_RUSURALUCA_DYNAMICARRAY_H
