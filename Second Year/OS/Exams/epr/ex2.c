// Write a C program that creates a linear hierarchy of n processes (a parent process creates a child process, which in turn creates a child process, and so on).

#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <stdio.h>

void f(int n) {
    if(n > 0) {
        int k = fork();
        if(k < 0) {
            perror("Error on fork");
            exit(1);
        } else if(k == 0) {
            printf("Child PID: %d Parent PID: %d\n", getpid(), getppid());
            f(n - 1);
        }
    }
    wait(0);
    exit(0);
}

int main(int argc, char **argv) {
    f(3);
    return 0;
}