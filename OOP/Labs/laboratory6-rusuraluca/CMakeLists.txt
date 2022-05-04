cmake_minimum_required(VERSION 3.21)
project(laboratory6_rusuraluca_bun)

set(CMAKE_CXX_STANDARD 14)

include_directories(Laboratory6)

add_executable(laboratory6_rusuraluca_bun
        Laboratory6/Date.cpp
        Laboratory6/Date.h
        Laboratory6/DynamicArray.cpp
        Laboratory6/DynamicArray.h
        Laboratory6/Tests/DynamicArrayTest.cpp
        Laboratory6/Tests/DynamicArrayTest.h
        Laboratory6/FilteringCriteria.cpp
        Laboratory6/FilteringCriteria.h
        Laboratory6/FilteringCriteriaTypeAndPrice.cpp
        Laboratory6/FilteringCriteriaTypeAndPrice.h
        Laboratory6/FilteringPrice.cpp
        Laboratory6/FilteringPrice.h
        Laboratory6/FilteringType.cpp
        Laboratory6/FilteringType.h
        Laboratory6/Tests/FilteringTest.cpp
        Laboratory6/Tests/FilteringTest.h
        Laboratory6/main.cpp
        Laboratory6/Offer.cpp
        Laboratory6/Offer.h
        Laboratory6/Tests/OfferTest.cpp
        Laboratory6/Tests/OfferTest.h)
