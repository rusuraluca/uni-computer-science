cmake_minimum_required(VERSION 3.21)
project(laboratoryproject_rusuraluca)

set(CMAKE_CXX_STANDARD 14)

add_executable(untitled ../laboratoryproject_rusuraluca/main.cpp
        ../laboratoryproject_rusuraluca/Tests/Tests.cpp
        ../laboratoryproject_rusuraluca/Tests/Tests.h
        ../laboratoryproject_rusuraluca/Persistency/Repo.cpp
        ../laboratoryproject_rusuraluca/Persistency/Repo.h
        ../laboratoryproject_rusuraluca/Exceptions/Exceptions.cpp
        ../laboratoryproject_rusuraluca/Exceptions/Exceptions.h
        ../laboratoryproject_rusuraluca/Domain/Recording.cpp
        ../laboratoryproject_rusuraluca/Domain/Recording.h
        ../laboratoryproject_rusuraluca/Persistency/FileRepo.cpp
        ../laboratoryproject_rusuraluca/Persistency/FileRepo.h
        ../laboratoryproject_rusuraluca/Controller/Controller.cpp
        ../laboratoryproject_rusuraluca/Controller/Controller.h
        ../laboratoryproject_rusuraluca/UI/UI.cpp
        ../laboratoryproject_rusuraluca/UI/UI.h
      )
