// Write a C program that receives a bash command (with options, if any) as command line arguments. 
// The program creates a child process that will execute the command and sends the standard output of the command back to the parent via pipe. 
// The parent will read everything from the pipe and display it.

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

#define buf_len 100

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Provide at least one argument");
        exit(1);
    }

    int p[2];
    if (0 > pipe(p)) {
        perror("Error creating pipe");
        exit(1);
    }

    int f = fork();

    if (0 > f) {
        perror("Error creating child process");

    } else if (0 == f) {
        close(p[0]);
        
        int copy_fd = dup(fileno(stdout)); // make a copy of the stdout file descriptor => equivalent to dup(1);
       
        if(0 > dup2(p[1], fileno(stdout))) {
            perror("Error on dup stdout");
            exit(1);
        }

        if (-1 == execvp(argv[1], argv + 1)) {
            perror("Error executing command");
            // restore the stdout descriptor if exec failed
            if(0 > dup2(copy_fd, fileno(stdout))) {
                perror("Error on dup stdout");
            }
            exit(1);
        }

        // This should never be reached
        exit(0);
    } else {
        close(p[1]);

        char *buf = malloc(sizeof(char) * buf_len);
        memset(buf, 0, sizeof(char) * buf_len);

        int k;
        while(0 < (k = read(p[0], buf, sizeof(char) * (buf_len - 1)))) {
            printf(buf);
            memset(buf, 0, sizeof(char) * buf_len);
        }
        
        free(buf);
        wait(NULL);
        close(p[0]);
    }
}