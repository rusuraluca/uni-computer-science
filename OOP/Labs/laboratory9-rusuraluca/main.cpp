#include <iostream>
#include <vector>
#include <cmath>
#include <cstdlib>
#include <array>

int isPerfectSquare(int elem){
    if (ceil((double)sqrt(elem)) == floor((double)sqrt(elem)))
        return 1;
    return 0;
}

int byLastDigit(int elem1, int elem2){
    if (elem1 % 10 < elem2 % 10)
        return 1;
    return 0;
}

int main() {
    std::cout << "a. Given a vector of doubles, check if all the numbers are positive.\n";
    std::vector<double> v1;

    v1 = { 7.5, -25.7, 16.23, 8.7 };
    std::cout << "Test 1: ";
    if (std::all_of(v1.begin(), v1.end(), [](double elem){return elem > 0;}) )
        std::cout << "All elements are positive numbers.\n";
    else
        std::cout << "NOT all elements are positive numbers.\n";

    v1 = { 7.5, 25.7, 16.23, 8.7 };
    std::cout << "Test 2: ";
    if (std::all_of(v1.begin(), v1.end(), [](double elem){return elem > 0;}) )
        std::cout << "All elements are positive numbers.\n";
    else
        std::cout << "NOT all elements are positive numbers.\n";

    std::cout << "b. Given an array of integers, print the first number that is a perfect square.\n";
    std::array<int, 200> v2 = { 7, -25, 16, 8 };
    std::array<int, 200>::iterator it;

    it = std::find_if(v2.begin(), v2.end(), isPerfectSquare);
    if(it != v2.end())
        std::cout << "The first perfect square is " << *it << ".\n";
    else
        std::cout << "No perfect square in the vector.\n";

    v2 = { 7, 13, 21, 3 };
    it = std::find_if(v2.begin(), v2.end(), isPerfectSquare);
    if(it != v2.end())
        std::cout << "The first perfect square is " << *it << ".\n";
    else
        std::cout << "No perfect square in the vector.\n";

    std::cout << "c. Given a vector of strings, "
                 "count the number of elements that have a length larger than a value n specified by the user. "
                 "(you need to use the capture clause to pass the value n to the lambda).\n";
    std::vector<std::string> v3;
    int n;

    v3 = {"stop", "star", "sir", "stroke", "str"};
    std::cout << "Give the value n: ";
    std::cin >> n;
    auto nrElem = std::count_if(v3.begin(), v3.end(),[n](std::string e){ return (int)(e.length()) > n; });
    std::cout << "The number of elements that have a length larger than given value is " << nrElem << ".\n";

    std::cout << "d. Given a vector of integers, sort them by the last digit in the number.\n";
    std::vector<int> v4;

    v4 = { 7, -25, 16, 8 };
    std::sort(v4.begin(), v4.end(), byLastDigit);
    for (auto i : v4)
        std::cout << i << ' ';
    std::cout << "\n";

    std::cout << "e. Given an array of chars, sort it and then use binary search to determine if a given char is present in the array.\n";
    std::array<char, 1000> v5 = {'a', 't', 'c', 'e', 'r'};

    std::sort(v5.begin(), v5.end());
    if (std::binary_search (v5.begin(), v5.end(), 'r'))
        std::cout << "Found!\n";
    else std::cout << "Not found.\n";



    return 0;
}
