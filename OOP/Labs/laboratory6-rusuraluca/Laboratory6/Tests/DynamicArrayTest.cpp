#include "DynamicArrayTest.h"

void DynamicArrayTest::runAllTests(){
    cout << "Starting Dynamic Array Test ⚙️ \n";
    DynamicArrayTests();
    cout << "Ended Dynamic Array Test ✅ \n";
}

void DynamicArrayTest::DynamicArrayTests(){
    DynamicArray arr(50);
    assert(arr.getLength() == 0);
    assert(arr.getCapacity() == 50);

    DynamicArray arr2;
    Offer o1('1', "Cluj", "Ibiza", 500, Date(12,03,2022), Date(19,03,2022), circuit);
    Offer o2('2', "Cluj", "Malibu", 1000, Date(14,03,2022), Date(29,04,2022), cruise);

    arr2.append(o1);
    arr2.append(o2);
    assert(arr2.getLength() == 2);
    arr2.remove(1);
    assert(arr2.getLength() == 1);
    arr2.remove(0);

    DynamicArray arr3 = arr2;
    arr3.append(o1);
    arr3.append(o2);
    assert(arr3.getLength() == 2);

    arr3.popBack();
    assert(arr3.getLength() == 1);
    arr3.popBack();
    try{
        arr3.popBack();
        assert(false);
    } catch(const std::length_error&) {
        assert(true);
    }

    DynamicArray arr4;
    arr4 = arr3;

    arr4.append(o1);
    arr4.append(o2);
    arr4.remove(0);
    assert(arr4.getLength() == 1);
    try {
        arr4.remove(23);
        assert(false);
    } catch(const std::length_error&) {
        assert(true);
    }

    Offer o3 = arr4.get(0);
    assert(o3.getPrice() == 1000);
    try {
        arr4.get(23);
        assert(false);
    } catch(const std::length_error&) {
        assert(true);
    }

}