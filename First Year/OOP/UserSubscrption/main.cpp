#include <iostream>
#include <exception>

#include "Persistency/Repo.h"

int main() {

    std::vector<Subscription*> arr;

    arr.push_back(new MonthlySubscription(0, "12/3/2022", "12/4/2022", 12));
    arr.push_back(new MonthlySubscription(1, "24/8/2022", "24/9/2022", 24));
    arr.push_back(new FreemiumSubscription(2, "12/3/2022", std::vector<Token*> {new Token("A", 12), new Token("B", 24)}));
    arr.push_back(new FreemiumSubscription(3, "24/8/2022", std::vector<Token*> {new Token("C", 36), new Token("D", 48)}));

    Repo users(arr);

    std::cout << "Welcome!" << std::endl;
    std::cout << "0 : Exit" << std::endl;
    std::cout << "1 : See all users" << std::endl;
    std::cout << "2 : Apply discount to all users" << std::endl;
    std::cout << "3 : Apply discount to a certain user" << std::endl;

    std::string confirm;
    int command;
    do {
        std::cout << "Provide command: ";
        std::cin >> command;
        switch (command){
            case 0: std::cout << "Bye!\n" << std::endl; break;
            case 1:
                std::cout << "Users are: \n";
                for (auto user: users.getAll()) {
                    std::cout << user->toString() << '\n';
                }
                break;
            case 2:
                int k;
                std::cout << "Provide discount: ";
                std::cin >> k;
                users.discount(k);

                std::cout << "Now users are: \n";
                for (auto user: users.getAll()) {
                    std::cout << user->toString() << '\n';
                }
                break;
            case 3:
                int id;
                std::cout << "Provide id of user: ";
                std::cin >> id;
                std::cout << "Provide discount: ";
                std::cin >> k;

                users.discountId(id, k);

                std::cout << "Now the user is: \n";
                for (auto user: users.getAll()) {
                    if (user->getId() == id)
                        std::cout << user->toString() << '\n';
                }

            default: std::cout << "Invalid"; break;
        }
        std::cout << "Press y or Y to continue:";
        std::cin >> confirm;
    } while (confirm == "y");

    return 0;
}
