cmake_minimum_required(VERSION 3.21)
project(CrazyTaxiClasses)

set(CMAKE_CXX_STANDARD 14)

add_executable(CrazyTaxiClasses main.cpp
        Domain/Taxi.cpp
        Domain/Taxi.h
        Persistency/RepoTaxi.cpp
        Persistency/RepoTaxi.h
        Business/Service.h
        )
