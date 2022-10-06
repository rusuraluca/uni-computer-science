#include "FilteringTest.h"

void FilteringTest::runAllTests() {
    std::cout << "Started Filtering tests ⚙️ \n";
    FilteringTests();
    std::cout << "Ended Filtering tests ✅ \n";
}

void FilteringTest::FilteringTests() {
    Offer o1('1', "Cluj", "Ibiza", 500, Date(12,03,2022), Date(19,03,2022), circuit);
    Offer o2('2', "Cluj", "Malibu", 1000, Date(14,03,2022), Date(29,04,2022), cruise);

    Offer o78('1', "Cluj", "Ibiza", 500, Date(12,03,2022), Date(19,03,2022), circuit);
    Offer o45('2', "Cluj", "Malibu", 1000, Date(14,03,2022), Date(29,04,2022), cruise);

    DynamicArray arr;
    arr.append(o1);
    arr.append(o2);

    FilteringPrice f(800);
    DynamicArray filteredArr = f.filter(arr);
    assert(filteredArr.getLength() == 1);

    FilteringType t(cruise);
    DynamicArray filteredArr2 = t.filter(arr);
    assert(filteredArr2.getLength() == 1);

    FilteringCriteriaTypeAndPrice a;
    DynamicArray filteredArr3 = a.filter(arr);
    assert(filteredArr3.getLength() == 0);

    FilteringCriteriaTypeAndPrice b(800, circuit);
    DynamicArray filteredArr4 = b.filter(arr);
    assert(filteredArr4.getLength() == 1);
}
