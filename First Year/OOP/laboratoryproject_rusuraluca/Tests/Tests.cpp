#include "Tests.h"
#include "../Domain/Recording.h"
#include "../Persistency/FileRepo.h"
#include "../Controller/Controller.h"

void Tests::runAllTests() {
    std::cout<<"starting tests...\n";
    this->runRepoTests();
    this->runFileRepoTests();
    std::cout<<"finishing tests...\n";
}

void Tests::runRepoTests() {
    std::cout<<"starting repo tests...\n";
    Repo<Recording> repo;

    assert(repo.size()==0);

    Recording a{1,"Beautiful people", "Emma Chamberlain", 28, "Video"};

    repo.add(a);

    assert(repo.size()==1);

    try{
        repo.add(a);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Existing element!\n");
    }

    Recording b{2,"New years resolutions", "Emma Chamberlain", 45.23, "Audio"};

    try{
        repo.remove(b);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Non-existent element!\n");
    }

    try{
        repo.update(b);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Non-existent element!\n");
    }

    repo.add(b);

    repo.remove(a);

    Recording c{3,"Weird times", "Emma Chamberlain", 12, "Audio"};

    repo.add(c);

    std::vector<Recording> all = repo.getAll();

    assert(all.size() == 2);

    repo.remove(c);

    assert(repo.size() == 1);

    std::cout<<"finishing repo tests...\n";
}

void Tests::runFileRepoTests() {
    std::cout<<"starting File Repo tests...\n";


    std::cout<<"finishing File Repo tests...\n";

}
