cmake_minimum_required(VERSION 3.21)
project(PodcastsInventory)

set(CMAKE_CXX_STANDARD 14)

add_executable(PodcastsInventory main.cpp
        Tests/Tests.cpp
        Tests/Tests.h
        Persistency/Repo.cpp
        Persistency/Repo.h
        Exceptions/Exceptions.cpp
        Exceptions/Exceptions.h
        Domain/Recording.cpp
        Domain/Recording.h
        Domain/Vlog.cpp
        Domain/Vlog.h
        Domain/Podcast.cpp
        Domain/Podcast.h
        Persistency/FileRepo.cpp
        Persistency/FileRepo.h
        Controller/Controller.cpp
        Controller/Controller.h
        UI/UI.cpp
        UI/UI.h
      )