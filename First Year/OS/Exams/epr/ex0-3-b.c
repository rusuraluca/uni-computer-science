#include <sys/types.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

int main(int argc, char *argv[]) {
    int a2b = open("./a2b", O_WRONLY);
    if(-1 == a2b) {
        perror("Error opening fifo from A to B");
        exit(1);
    }
    int c2a = open("./c2a", O_RDONLY);
    if(-1 == c2a) {
        perror("Error opening fifo from C to A");
        exit(1);
    }
    srandom(getpid());
    int nr = random() % 900 + 100;
    while(1) {
        if(nr >= 10) {
            nr++;
        }
        printf("A -> send -> %d\n", nr);
        if(0 > write(a2b, &nr, sizeof(int))) {
            perror("Error writing number from A to B");
            exit(1);
        }

        if(nr < 10) {
            break;
        }

        if(0 > read(c2a, &nr, sizeof(int))) {
            perror("Error reading number from C");
            exit(1);
        }
        printf("A -> receive -> %d\n", nr);
    }

    close(a2b);
    close(c2a);

    return 0;
}
