cmake_minimum_required(VERSION 3.26)
project(pdp_lab2)

set(CMAKE_CXX_STANDARD 20)

include_directories(.)

add_executable(pdp_lab2
        main.cpp
        ProducerConsumerQueue.hpp)
