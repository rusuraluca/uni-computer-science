cmake_minimum_required(VERSION 3.26)
project(pdp_lab7)

include_directories(/opt/homebrew/include)


set(CMAKE_CXX_STANDARD 14)
set(CMAKE_C_COMPILER "/opt/homebrew/bin/mpicc")
set(CMAKE_CXX_COMPILER "/opt/homebrew/bin/mpicxx")


add_executable(pdp_lab7
        mpi_karasuba.cpp
        mpi_naive.cpp)
