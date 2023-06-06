/*
24. Write a C program that creates N threads and one child process (N given as a command line argument). 
Each thread will receive a unique id from the parent. 
Each thread will generate two random numbers between 1 and 100 and will print them together with its own id. 
The threads will send their generated numbers to the child process via pipe or FIFO. 
The child process will calculate the average of each pair of numbers received from a thread 
and will print it alongside the thread id. Use efficient synchronization.
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <fcntl.h>

typedef struct {
    int id;
    int fd;
} data;

void *f(void *arg) {
    data d = *((data*) arg);
    int n1 = random() % 100 + 1;
    int n2 = random() % 100 + 1;
    printf("Thread %d generated %d and %d\n", d.id, n1, n2);
    if (0 > write(d.fd, &n1, sizeof(int))) {
        perror("Error on write to channel: ");
        exit(1);
    }
    if (0 > write(d.fd, &n2, sizeof(int))) {
        perror("Error on write to channel: ");
        exit(1);
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Provide one argument!\n");
        exit(1);
    }

    int N = atoi(argv[1]);
    int fd[2];
    if (0 > pipe(fd)) {
        perror("Error on pipe: ");
        exit(1);
    }

    pthread_t *th = malloc(sizeof(pthread_t) * N);
    data *d = malloc(sizeof(data) * N);

    for (int i = 0; i < N; ++i) {
        d[i].id = i;
        d[i].fd = fd[1];
        if (0 != pthread_create(&th[i], NULL, f, &d[i])) {
            perror("Cannot create thread");
            exit(1);
        }
    }

    for (int i = 0; i < N; ++i) {
        pthread_join(th[i], NULL);
    }

    free(th);
    free(d);

    int n1, n2;
    for (int i = 0; i < N; ++i) {
        if (0 > read(fd[0], &n1, sizeof(int))) {
            perror("Error on read from channel: ");
            exit(1);
        }
        if (0 > read(fd[0], &n2, sizeof(int))) {
            perror("Error on read from channel: ");
            exit(1);
        }
        printf("Child process received %d and %d from thread %d\n", n1, n2, i);
        printf("Average of %d and %d is %f\n", n1, n2, (n1 + n2) / 2.0);
    }

    close(fd[0]);
    close(fd[1]);
    return 0;
}