cmake_minimum_required(VERSION 3.21)
project(Matrix)

set(CMAKE_CXX_STANDARD 14)

include_directories(.)

add_executable(Matrix
        App.cpp
        ExtendedTest.cpp
        ExtendedTest.h
        Matrix.cpp
        Matrix.h
        ShortTest.cpp
        ShortTest.h)
