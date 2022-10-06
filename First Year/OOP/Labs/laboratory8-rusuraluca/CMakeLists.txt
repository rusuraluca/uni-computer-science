cmake_minimum_required(VERSION 3.21)
project(laboratory8_rusuraluca)

set(CMAKE_CXX_STANDARD 14)

add_executable(laboratory8_rusuraluca
        main.cpp
        Repo/DynamicArray.h
        Interface/FilteringCriteria.h
        Interface/FilteringCriteriaAnd.h
        Interface/FilteringCriteriaAnd.cpp
        Interface/FilteringCriteriaOr.h
        Interface/FilteringCriteriaOr.cpp
        Interface/FilteringDeparture.cpp
        Interface/FilteringDeparture.h
        Interface/FilteringPrice.cpp
        Interface/FilteringPrice.h
        Interface/FilteringType.cpp
        Interface/FilteringType.h
        Domain/Date.cpp
        Domain/Date.h
        Domain/Offer.cpp
        Domain/Offer.h
        )
