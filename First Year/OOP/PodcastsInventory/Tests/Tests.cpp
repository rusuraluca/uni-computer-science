#include "Tests.h"
#include "../Domain/Podcast.h"
#include "../Domain/Vlog.h"
#include "../Persistency/FileRepo.h"
#include "../Controller/Controller.h"
#include "../UI/UI.h"

void Tests::runAllTests() {
    std::cout<<"\nStarted tests: ⚙️️ \n";
    this->runRecordingTests();
    this->runRepoTests();
    this->runFileRepoTests();
    this->runControllerTests();
    std::cout<<"Finished tests: ✅️\n\n\n";
}

void Tests::runRecordingTests() {
    std::cout<<"Recording Tests...";
    Recording a1;
    Podcast b1;
    Vlog c1;

    Recording a{1,"Beautiful people", "Emma Chamberlain", 28, "video"};
    assert(a.getId() == 1);
    a.setId(12);
    assert(a.getId() == 12);
    assert(a.getTitle() == "Beautiful people");
    a.setTitle("Other Beautiful people");
    assert(a.getTitle() == "Other Beautiful people");
    assert(a.getAuthor() == "Emma Chamberlain");
    a.setAuthor("John May");
    assert(a.getAuthor() == "John May");
    assert(a.getLength() == 28);
    a.setLength(17);
    assert(a.getLength() == 17);
    assert(a.getType() == "video");
    a.setType("audio");
    assert(a.getType() == "audio");
    a1 = a;

    Recording wrong{-1,"Beautiful people", "Emma Chamberlain", 28, "video"};
    try {
        ValidatorRecording::validateRecording(wrong);
    } catch (const ValidationException& ex) {
        assert(ex.getMsg() == "Incorrect id!\n");
    }
    Podcast b{2,"New years resolutions","Emma Chamberlain",45.23,"audio", 2};
    assert(b.getId() == 2);
    b.setId(12);
    assert(b.getId() == 12);
    assert(b.getTitle() == "New years resolutions");
    b.setTitle("Other Beautiful people");
    assert(b.getTitle() == "Other Beautiful people");
    assert(b.getAuthor() == "Emma Chamberlain");
    b.setAuthor("John May");
    assert(b.getAuthor() == "John May");
    assert(b.getLength() == 45.23);
    b.setLength(17);
    assert(b.getLength() == 17);
    assert(b.getType() == "audio");
    b.setAuthor("video");
    assert(b.getAuthor() == "video");
    assert(b.getMaxSpeed() == 2);
    b.setMaxSpeed(1);
    assert(b.getMaxSpeed() == 1);
    b1 = b;

    Podcast wrong1{-1,"Beautiful people", "Emma Chamberlain", 28, "video", 2};
    try {
        ValidatorPodcast::validatePodcast(wrong1);
    } catch (const ValidationException& ex) {
        assert(ex.getMsg() == "Incorrect id!\n");
    }
    Vlog c{3,"Weird times", "Emma Chamberlain", 12, "audio", 2000};
    assert(c.getId() == 3);
    c.setId(12);
    assert(c.getId() == 12);
    assert(c.getTitle() == "Weird times");
    c.setTitle("Other Beautiful people");
    assert(c.getTitle() == "Other Beautiful people");
    assert(c.getAuthor() == "Emma Chamberlain");
    c.setAuthor("John May");
    assert(c.getAuthor() == "John May");
    assert(c.getLength() == 12);
    c.setLength(17);
    assert(c.getLength() == 17);
    assert(c.getType() == "audio");
    c.setAuthor("video");
    assert(c.getAuthor() == "video");
    assert(c.getQuality() == 2000);
    c.setQuality(1540);
    assert(c.getQuality() == 1540);
    c1 = c;

    Vlog wrong2{-1,"Beautiful people", "Emma Chamberlain", 28, "video", 2000};
    try {
        ValidatorVlog::validateVlog(wrong2);
    } catch (const ValidationException& ex) {
        assert(ex.getMsg() == "Incorrect id!\n");
    }
    Recording a2(a);
    assert(a2.getType() == "audio");
    Podcast b2(b);
    assert(b.getMaxSpeed() == 1);
    Vlog c2(c);
    assert(c2.getQuality() == 1540);
    std::cout<<"✅\n";
}

void Tests::runRepoTests() {
    std::cout<<"Repo Tests...";
    Repo<Recording> repo;

    assert(repo.size()==0);
    Recording a{1,"Beautiful people", "Emma Chamberlain", 28, "video"};

    repo.add(a);

    assert(repo.size()==1);
    try{
        repo.add(a);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Existing element!\n");
    }
    Recording b{2,"New years resolutions", "Emma Chamberlain", 45.23, "audio"};

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

    Recording c{3,"Weird times", "Emma Chamberlain", 12, "audio"};

    repo.add(c);

    std::vector<Recording> all = repo.getAll();

    assert(all.size() == 2);
    repo.remove(c);

    assert(repo.size() == 1);

    std::cout<<"✅\n";
}

void Tests::runFileRepoTests() {
    std::cout<<"File Repo Tests...";

    FileRepo<Recording> repo{"test-inventory.csv"};
    Recording b{2,"New years resolutions","Emma Chamberlain",45.23,"audio"};
    Recording c{3,"Weird times", "Emma Chamberlain", 12, "audio"};

    std::vector<Recording> all = repo.getAll();

    assert(all.size() == 1);

    repo.add(b);
    try{
        repo.add(b);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Existing element!\n");
    }
    repo.update(b);
    try{
        repo.update(c);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Non-existent element!\n");
    }
    repo.remove(b);
    try{
        repo.remove(b);
        assert(false);
    }catch (const RepoException& re){
        assert(re.getMsg()=="Non-existent element!\n");
    }
    try{
        FileRepo<Recording> repo2{"non-existing-file.csv"};
        repo2.size();
        assert(false);
    }catch (const FileException& re){
        assert(re.getMsg()=="File can't be opened!\n");
    }
    std::cout<<"✅\n";
}


void Tests::runControllerTests() {
    std::cout << "Controller Tests...";
    FileRepo<Recording> repo{"test-inventory.csv"};
    Controller<Recording> ctrl{repo};
    Recording b{2, "New years resolutions", "Emma Chamberlain", 45.23, "audio"};
    Recording c{3, "Weird times", "Emma Chamberlain", 12, "audio"};

    std::vector<Recording> all = ctrl.getAll();
    assert(all.size() == 1);
    ctrl.add(b);

    try {
        ctrl.add(b);
        assert(false);
    } catch (const RepoException &re) {
        assert(re.getMsg() == "Existing element!\n");
    }
    ctrl.update(b);
    try {
        ctrl.update(c);
        assert(false);
    } catch (const RepoException &re) {
        assert(re.getMsg() == "Non-existent element!\n");
    }
    ctrl.remove(b);
    try {
        ctrl.remove(b);
        assert(false);
    } catch (const RepoException &re) {
        assert(re.getMsg() == "Non-existent element!\n");
    }
    try {
        ctrl.add(Recording{-3, "New years resolutions", "Emma Chamberlain", 45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Incorrect id!\n");
    }
    try {
        ctrl.add(Recording{3, "", "Emma Chamberlain", 45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Title cannot be empty!\n");
    }
    try {
        ctrl.add(Recording{3, "New years resolutions", "", 45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Author cannot be empty!\n");
    }
    try {
        ctrl.add(Recording{3, "New years resolutions", "Emma Chamberlain", -45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Length cannot be empty or negative!\n");
    }
    try {
        ctrl.add(Recording{3, "New years resolutions", "Emma Chamberlain", 45.23, ""});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Recording type cannot be empty: is either video or audio!\n");
    }
    try {
        ctrl.remove(Recording{-3, "New years resolutions", "Emma Chamberlain", 45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Incorrect id!\n");
    }
    try {
        ctrl.remove(Recording{3, "", "Emma Chamberlain", 45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Title cannot be empty!\n");
    }
    try {
        ctrl.remove(Recording{3, "New years resolutions", "", 45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Author cannot be empty!\n");
    }
    try {
        ctrl.remove(Recording{3, "New years resolutions", "Emma Chamberlain", -45.23, "audio"});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Length cannot be empty or negative!\n");
    }
    try {
        ctrl.remove(Recording{3, "New years resolutions", "Emma Chamberlain", 45.23, ""});
        assert(false);
    } catch (const ValidationException &re) {
        assert(re.getMsg() == "Recording type cannot be empty: is either video or audio!\n");
    }
    ctrl.add(b);

    all = ctrl.getAll();
    assert(ctrl.size() == 2);
    ctrl.remove(b);
    ctrl.undo();
    ctrl.redo();
    try {
        ctrl.remove(b);
        assert(false);
    } catch (const RepoException &re) {
        assert(re.getMsg() == "Non-existent element!\n");
    }
    ctrl.add(b);
    ctrl.undo();
    ctrl.remove(b);
    try{
        ctrl.remove(b);
    }catch (const RepoException &re) {
        assert(re.getMsg() == "Non-existent element!\n");
    }
    ctrl.add(c);
    ctrl.undo();
    try{
        ctrl.remove(c);
    }catch (const RepoException &re) {
        assert(re.getMsg() == "Non-existent element!\n");
    }
    ctrl.add(c);
    try{
        ctrl.redo();
    }catch (const RepoException &re) {
        assert(re.getMsg() == "Non-existent element!\n");
    }
    ctrl.remove(c);
    std::cout<<"✅\n";
}