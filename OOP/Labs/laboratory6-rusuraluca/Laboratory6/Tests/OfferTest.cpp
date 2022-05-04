#include "OfferTest.h"

void OfferTest::runAllTests(){
    std::cout << "Started Offer tests ⚙️ \n";
    OfferTests();
    std::cout << "Ended Offer tests ✅ \n";
}

void OfferTest::OfferTests(){
    Offer o;
    assert(o.getPrice() == 0);
    assert(o.to_string() == "No offer");
    Offer o1('1', "Cluj", "Ibiza", 500, Date(12,03,2022), Date(19,03,2022), circuit);
    Offer o2('2', "Cluj", "Malibu", 1000, Date(14,03,2022), Date(29,04,2022), cruise);
    Offer o3 = o2;
    o = o1;
    assert(o1.getPrice() == 500);
    assert(o.getPrice() == o1.getPrice());
    assert(o3.getType() == o2.getType());
    assert(o3.getPrice() == o2.getPrice());

    Offer o4('3', "Bucharest", "Rome", 350, Date(), Date(), cityBreak);
    Offer o5('4', "Malibu", "Cluj", 1000, Date(), Date(), cityBreak);

    Date p(12,03,2022), v(19,03,2022);
    Offer o6('5', "Rome", "Bucharest", 350, p, v, cityBreak);
    assert(p.date_to_string() == "12/3/2022");
    assert(v.date_to_string() == "19/3/2022");
}
