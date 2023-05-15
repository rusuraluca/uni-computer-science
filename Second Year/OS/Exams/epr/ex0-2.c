#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <string.h>
int main(int argc, char *argv[]) {
    int n = argc - 1;
    int c2p[n][2];
    for(int i = 0; i < n; i++) {
        if(0 > pipe(c2p[i])) {
            perror("Error creating pipes");
            exit(1);
        }
    }
    int total_len = 0;
    for(int i = 0; i < n; i++) {
        // calculate the total length of the result -> sum of the lengths of all arguments + 1 for the NULL terminator
        total_len += strlen(argv[i+1]);
        int f = fork();
        if(0 > f) {
            perror("Error on fork");
        } else if (0 == f) {
            for(int j = 0; j < n; j++) {
                //close all pipes except the writing end of the pipe to be used by this particular child process (ie. the i-th child process)
                if(j != i) {
                    close(c2p[j][0]);
                    close(c2p[j][1]);
                } else {
                    close(c2p[j][0]);
                }
            }
            // we can create a copy of the argument if we want, but since the child has access to a copy of the command line arguments anyway, might as well use them
            int len = strlen(argv[i+1]);
            for(int j = 0; j < len; j++) {
                if(argv[i+1][j] >= 'a' && argv[i+1][j] <= 'z') {
                    argv[i+1][j] += 'A' - 'a';
                }
            }
            if(0 > write(c2p[i][1], &len, sizeof(int))) {
                perror("Error while sending the argument length from the child process");
                close(c2p[i][1]);
                exit(1);
            }
            if(0 > write(c2p[i][1], argv[i+1], sizeof(char) * len)) {
                perror("Error while sending the modified argument from the child process");
                close(c2p[i][1]);
                exit(1);
            }
            close(c2p[i][1]);
            exit(0);
        }
    }
    char *result = malloc(sizeof(char) * (total_len + 1));
    memset(result, 0, sizeof(char) * (total_len + 1));
    for(int i = 0; i < n; i++) {
        int len;
        if(0 > read(c2p[i][0], &len, sizeof(int))) {
            perror("Error on reading argument length in parent process");
        } else {
            char *buf = malloc(sizeof(char) * (len + 1));
            if(0 > read(c2p[i][0], buf, sizeof(char) * len)) {
                perror("Error reading argument in parent process");
            } else {
                buf[len] = 0;
                strcat(result, buf);
            }
            free(buf);
        }
        wait(0);
    }
    printf("%s\n", result);
    free(result);
    return 0;
}
