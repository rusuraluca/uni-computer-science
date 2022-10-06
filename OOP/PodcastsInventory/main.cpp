#include <iostream>
#include "Tests/Tests.h"
#include "Controller/Controller.h"
#include "UI/UI.h"

int main() {
    Tests t;
    t.runAllTests();

    FileRepo<Recording> repo{"inventory.csv"};
    Controller<Recording> ctrl{repo};
    UI ui{ctrl};
    ui.runApplication();

    return 0;
}
