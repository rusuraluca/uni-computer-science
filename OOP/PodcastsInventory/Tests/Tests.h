#pragma once

/*!
 * \class  Tests.
 * \brief  This are all the tests for the app.
 */
class Tests {
private:
    void runRecordingTests();
    void runRepoTests();
    void runFileRepoTests();
    void runControllerTests();

public:
    void runAllTests();
};

