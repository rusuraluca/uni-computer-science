cmake_minimum_required(VERSION 3.21)
project(UserSubscrption)

set(CMAKE_CXX_STANDARD 14)

add_executable(UserSubscrption main.cpp
        Persistency/Repo.h
        Persistency/Repo.cpp
        Domain/Subscription.h
        Domain/Subscription.cpp
        Domain/Token.h
        Domain/Token.cpp)
