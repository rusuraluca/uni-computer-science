#include <iostream>
#include <fstream>
#include <string>
#include <stack>
#include <vector>
#include <queue>
#include <set>
using namespace std;

/* Prototypes */
void getWords(string &word1, string &word2);
void printSolution(string word1, string word2);
void testMain();

/* Main function */
int main() {

    // testMain();

    string word1, word2;
    getWords(word1, word2);
    printSolution(word1, word2);

    return 0;
}
/*
 * Function: testMain
 * Usage:testMain();
 * -----------------------------
 * This function provides some tests.
 */
void testMain(){
    cout << "Test #1 from same to cast:" << '\n';
    printSolution("same", "cast");
    cout << "\nTest #1 ✅" << endl;
    cout << endl;

    cout << "Test #2 from cold to warm:" << '\n';
    printSolution("cold", "warm");
    cout << "\nTest #2 ✅" << endl;
    cout << endl;

    cout << "Test #3 from carrier to flaming:" << '\n';
    printSolution("carrier", "flaming");
    cout << "\nTest #3 ✅\n\n";

    cout << "Test #4 from change to hacker:" << '\n';
    printSolution("change", "hacker");
    cout << "\nTest #4 ✅\n\n\n";
}

/*
 * Function: getWords
 * Usage: getWords(word1, word2)
 * -----------------------------
 * This function takes two strings as parameter (passed by reference),
 * prompts the user for her input and stores her answer in those two
 * parameters.
 *
 * The user must enter strings of same length, otherwise the function
 * keeps asking for new words.
 */

void getWords(string &word1, string &word2) {
    while (true) {
        cout << "Please enter a word: ";
        cin>>word1;

        cout << "Please enter another word of the same length: ";
        cin>>word2;

        if (word1.length() == word2.length()) {
            break;
        }
        cout << "Please enter two words with the same length." << endl;
    }
}


/*
 * Function: printSolution
 * Usage: printSolution(word1, word2)
 * ------------------------------
 * This function takes two strings as parameters and prints the
 * minimal-steps solution between two words.
 *
 * A solution is a connection from one word to another formed
 * by changing one letter at a time with the constraint that at each
 * step the sequence of letters still forms a valid word.
 */

void printSolution(string word1, string word2) {

    // Creates an empty queue of stacks
    queue<stack<string> > myQueue;

    // Create a stack which will contain a final word solution
    stack<string> wordSolution;

    // Creates and adds a stack containing word1 to the queue
    stack<string> myStack;
    myStack.push(word1);
    myQueue.push(myStack);

    // Creates two sets: one for the dictionary and one for the tested words
    string token;
    ifstream dictionary("words_alpha.txt");
    set<string> myDictionary;
    set<string> testedWords;

    if (dictionary.is_open()) {

        while (dictionary >> token) {
            myDictionary.insert(token);
        }

        // While the queue is not empty:
        while (!(myQueue.empty())) {

            // Dequeue the partial-solution stack from the front of the queue
            stack<string> ladder = myQueue.front();
            myQueue.pop();
            string word = ladder.top();

            // If the word on top of the stack is the destination word:
            if (word == word2) {

                // Yeey!
                // Output the elements of the stack as the solution
                cout << "The solution from " << word1 << " to " << word2 << " is \n";

                //Copy the ladder stack to wordSolution to take it in the order.
                while (!ladder.empty()) {
                    wordSolution.push(ladder.top());
                    ladder.pop();
                }
                while (!wordSolution.empty()) {
                    cout << "< " << wordSolution.top() << " > ";
                    wordSolution.pop();
                }
            } else {
                // For each valid English word that is a "neighbor"
                // (differs by 1 letter) of the word on top of the stack:
                string test;
                for (int i = 0; i < word.size(); i++) {
                    for (char j = 'a'; j <= 'z'; j++) {
                        test = word.substr(0, i) + j + word.substr(i + 1);

                        // If that word is an english word
                        if (myDictionary.count(test)) {

                            // If that neighbor word has not already been used in a solution before:
                            if (!testedWords.count(test)) {

                                // Create a copy of the current solution stack
                                stack<string> copy = ladder;

                                // Put the neighbor word on top of the copy stack
                                copy.push(test);

                                // Add the copy stack to the end of the queue
                                myQueue.push(copy);
                            }
                        }

                        // Add test to tested words because it is already used.
                        testedWords.insert(test);
                    }
                }
            }
        }
    } else {
        cerr << "Couldn't open the dictionary" << endl;
    }
}