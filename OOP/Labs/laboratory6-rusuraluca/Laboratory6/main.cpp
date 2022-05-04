#include "Tests/OfferTest.h"
#include "Tests/FilteringTest.h"
#include "Tests/DynamicArrayTest.h"

#include <iostream>
using namespace std;

#include "Offer.h"
#include "DynamicArray.h"
#include "FilteringCriteriaTypeAndPrice.h"

void displayMenu() {
    int ok = 1;
    std::string option;

    DynamicArray arr;
    DynamicArray filteredArr;
    char _id;
    std::string _departure, _destination;
    double _price;
    Date _start, _end;
    int _type;

    while(ok){
        printf("\n ☺️ Please select your option:\n");
        printf("A|a     Add an offer\n");
        printf("S|s     Show all offers\n");
        printf("P|p     Filter offers by price\n");
        printf("T|t     Filter offers by type\n");
        printf("B|b     Filter offers by type and price\n");
        printf("Q|q     Quit\n");

        cin >> option;

        if(option == "Q" || option == "q"){
            cout << "\nBye!☺️";
            ok = 0;
        }
        else if(option == "A" || option == "a"){
            cout << "\nPlease provide the following attributes:\n";
            cout << "Id:";
            cin >> _id;
            cout << "Departure:";
            cin >> _departure;
            cout << "Destination:";
            cin >> _destination;
            cout << "Price:";
            cin >> _price;
            cout << "Start Date:";
            cin >> _start;
            cout << "End Date:";
            cin >> _end;
            cout << "\nType:";
            cin >> _type;
            int len = arr.getLength();
            Offer o(_id, _departure, _destination, _price, _start, _end, static_cast<offer_type>(_type));
            arr.append(o);
            if(arr.getLength() > len){
                cout << "\nOffer Created:";
                cout << o.to_string();
            }
        }
        else if(option == "S" || option == "s"){
            if(arr.getLength() > 0){
                cout << "All offers:\n";
                cout << arr;
            }
            else cout << "No offers at the moment.\n";
        }
        else if(option == "P" || option == "p"){
            cout << "Please provide a price: ";
            cin >> _price;
            FilteringPrice f(_price);
            filteredArr = f.filter(arr);
            if(filteredArr.getLength() != 0)
                cout << filteredArr;
            else cout << "No such offers at the moment.\n";
        }
        else if(option == "T" || option == "t"){
            cout << "Please provide a type: ";
            cin >> _type;
            FilteringType f(static_cast<offer_type>(_type));
            filteredArr = f.filter(arr);
            if(filteredArr.getLength() != 0)
                cout << filteredArr;
            else cout << "No such offers at the moment.\n";
        }
        else if(option == "B" || option == "b"){
            cout << "Please provide a price: ";
            cin >> _price;
            cout << "\nPlease provide a type: ";
            cin >> _type;
            FilteringCriteriaTypeAndPrice f(_price, static_cast<offer_type>(_type));
            filteredArr = f.filter(arr);
            if(filteredArr.getLength() != 0)
                cout << filteredArr;
            else cout << "No such offers at the moment.\n";
        }
    }
}

int main() {

	OfferTest::runAllTests();
	FilteringTest::runAllTests();
	DynamicArrayTest::runAllTests();

	displayMenu();
	
	return 0;
}