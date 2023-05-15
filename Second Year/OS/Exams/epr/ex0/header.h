// Write two C programs that communicate via  FIFO. 
// One program (A) will generate a random number N between 0 and 1000. 
// The other program (B) will try to guess the generated number. B will start by generating a random number between 0 and 1000, 
// and will send it to A which will respond with -1 if the “guess” was lower than N, 1 if the “guess” is greater than N and 0 
// If the guess is correct. B will continuously restrict the guesses based on the responses from A and will stop once it correctly guesses the number. 
// Program A will create and destroy the FIFO.

#ifndef HEADER_H_
#define HEADER_H_

char *myfifo1 = "./myfifo1";
char *myfifo2 = "./myfifo2";

#endif