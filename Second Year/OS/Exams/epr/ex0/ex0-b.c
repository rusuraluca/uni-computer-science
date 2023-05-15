#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>

#include "header.h"

int main (int argc, char *argv[]) {
    int fd_read = open(myfifo1, O_RDONLY);
    if(-1 == fd_read) {
        perror("Error opening fifo 1 in B");
        exit(1);
    }
    int fd_write = open(myfifo2, O_WRONLY);
    if(-1 == fd_write) {
        perror("Error opening fifo 2 in B");
        close(fd_read);
        exit(1);
    }
    srandom(getpid());
    int min = 0, max = 1001;
    int not_guessed = 1;
    while(not_guessed) {
        int guess = random() % (max - min) + min;
        if(0 > write(fd_write, &guess, sizeof(int))) {
            perror("Error on write to A");
            break;
        }
        if(0 > read(fd_read, &not_guessed, sizeof(int))) {
            perror("Error on read from B");
            break;
        }
        if (-1 == not_guessed) {
            min = guess + 1;
        } else if (1 == not_guessed) {
            max = guess;
        }
        sleep(1);
    }

    close(fd_write);
    close(fd_read);
    return 0;
}