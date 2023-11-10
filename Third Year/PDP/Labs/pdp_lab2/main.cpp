//
// Created by Rusu Raluca on 30.10.2023.
//

#include <iostream>
#include <condition_variable>
#include <limits>
#include <thread>
#include "ProducerConsumerQueue.hpp"

void scalarProduct(std::vector<int>& a, std::vector<int>& b) {
    if (a.size() != b.size())
        throw std::domain_error("Vectors are of different sizes");

    ProducerConsumerQueue<int> threadSafeQueue;
    std::thread th_prod([&]() {
        for (int i = 0; i < a.size(); i++) {
            int pairProd = a[i] * b[i];
            threadSafeQueue.enqueue(pairProd);
        }
        threadSafeQueue.enqueue(std::numeric_limits<int>::max());
    });

    std::thread th_sum([&]() {
        int sum = 0;
        while (true) {
            int k = threadSafeQueue.dequeue();
            if (k == std::numeric_limits<int>::max()) {
                break;
            }
            sum += k;
        }
        std::cout << sum << std::endl;
        std::cout.flush();
    });

    th_prod.join();
    th_sum.join();
}


int main() {
    std::vector<int> matrix(1000, 1);

    try {
        scalarProduct(matrix, matrix);
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }




    std::vector<int> matrix2;
    matrix2.reserve(1000);

    for (int i = 1; i <= 1000; i++) {
        matrix2.push_back(i);
    }

    try {
        scalarProduct(matrix2, matrix2);
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}