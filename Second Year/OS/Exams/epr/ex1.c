// Write a C program that creates n child processes. 
// Each child process will print its PID and its parent PID.
// The parent process will print its PID and the PID of each of the child processes.

#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv) {
  int i, n = 3;
  for(i = 0; i < n; i++) {
    int f = fork();
    if (-1 == f) {
      perror("Error on fork");
    } else if (0 == f) {
      printf("C - Child PID: %d Parent PID: %d\n", getpid(),getppid());
      exit(0);
    } else {
      printf("P - Child PID: %d Parent PID: %d\n", f, getpid());
    }
  }
  for(i = 0; i < n; i++) {
    wait(0);
  }
  printf("Message!\n");
  return 0;
}
