/*
Write a C program that takes as command line arguments 2 numbers: N and M. 
The program will simulate a thread race that have to pass through M checkpoints.
Through each checkpoint the threads must pass one at a time (no 2 threads can be inside the same checkpoint). 
Each thread that enters a checkpoint will wait between 100 and 200 milliseconds (usleep(100000) makes a thread or process wait for 100 milliseconds) 
and will print a message indicating the thread number and the checkpoint number, then it will exit the checkpoint. 
Ensure that no thread will try to pass through a checkpoint until all threads have been created.
*/
#define _XOPEN_SOURCE 600 /* Or higher */
#define _POSIX_C_SOURCE 200112L /* Or higher */
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>
#include <sys/types.h>
#include "barrier.h"

typedef struct {
    int id, M;
    pthread_mutex_t *mutexes;
    pthread_barrier_t *barrier;
} data;

void *f(void *arg) {
    data d = *((data*) arg);
    int i;
    printf("Thread %d is waiting...\n", d.id);
    pthread_barrier_wait(d.barrier);
    for (i = 0; i < d.M; i++) {
        pthread_mutex_lock(&d.mutexes[i]);
        printf("Thread %d has entered checkpoint %d\n", d.id, i);
        int n = (random() % 101 + 100) * 1000;
        usleep(n);
        pthread_mutex_unlock(&d.mutexes[i]);
    }
    printf("Thread %d finished\n", d.id);
    return NULL;
}

void destroy_mutexes(pthread_mutex_t *mutexes, int count) {
    int i;
    for (i = 0; i < count; i++) {
        pthread_mutex_destroy(&mutexes[i]);
    }
}

void wait_threads(pthread_t *T, int count) {
    int i;
    for (i = 0; i < count; i++) {
        pthread_join(T[i], NULL);
    }
}

void cleanup(pthread_t *T, data *args, pthread_mutex_t *mutexes) {
    free(T);
    free(args);
    free(mutexes);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Please provide 2 arguments!\n");
        exit(1);
    }
    int N = atoi(argv[1]);
    int M = atoi(argv[2]);
    pthread_t *T = malloc(sizeof(pthread_t) * N);
    data *args = malloc(sizeof(data) * N);
    pthread_mutex_t *mutexes = malloc(sizeof(pthread_mutex_t) * M);
    pthread_barrier_t barrier;
    if (0 > pthread_barrier_init(&barrier, NULL, N)) {
        cleanup(T, args, mutexes);
        exit(1);
    }
    int i;
    for (i = 0; i < M; i++) {
        if(0 > pthread_mutex_init(&mutexes[i], NULL)) {
            destroy_mutexes(mutexes, i);
            pthread_barrier_destroy(&barrier);
            cleanup(T, args, mutexes);
            exit(1);
        }
    }
    srandom(time(NULL));
    for (i = 0; i < N; i++) {
        args[i].id = i;
        args[i].M = M;
        args[i].barrier = &barrier;
        args[i].mutexes = mutexes;
        if(0 > pthread_create(&T[i], NULL, f, (void *) &args[i])) {
            perror("Error on create thread");
            wait_threads(T, i);
            pthread_barrier_destroy(&barrier);
            destroy_mutexes(mutexes, M);
            cleanup(T, args, mutexes);
            exit(1);
        }
    }

    wait_threads(T, N);
    pthread_barrier_destroy(&barrier);
    destroy_mutexes(mutexes, M);
    cleanup(T, args, mutexes);
    return 0;
}