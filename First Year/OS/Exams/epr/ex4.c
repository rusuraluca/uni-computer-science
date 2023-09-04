// Write a C program that runs a bash command (potentially with arguments) received as a command line argument and times its execution.
// e.g. ./exe grep -E -c "^[a-z]{4}[0-9]{4}" /etc/passwd
//      ./ex4 grep -E -c "^[a-z]" ex1.c

#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>

/*
int main(int argc, char **argv) {
    int f = fork();
    if(f < 0) {
        perror("Error on fork");
        exit(1);
    } else if(f == 0) {
        execvp(argv[1], argv + 1);
    } else {
        wait(0);
    }
    return 0;
}
*/

int main(int argc, char *argv[]) {
    struct timeval tv1, tv2;
    if (argc < 2) {
        printf("Please provide at least one argument.\n");
        exit(1);
    }
    gettimeofday(&tv1, NULL);
    int f = fork();
    if(-1 == f) {
        perror("Error on fork: ");
        exit(1);
    } else if (0 == f) {
        if( -1 == execvp(argv[1], argv + 1)) {
            perror("Error running the given command: ");
            exit(1);
        }
    } else {
        wait(0);
        gettimeofday(&tv2, NULL);
        printf("Total time = %f seconds\n", (double)(tv2.tv_usec - tv1.tv_usec) / 1000000 + (double) (tv2.tv_sec - tv1.tv_sec));
    }
    return 0;
}