/*
21. Write a C program that creates 2^N threads that race to the finish (N is a command line argument). 
The threads must pass through N checkpoint.
The checkpoint with number X will allow half as many threads to pass simultaneously than checkpoint number X - 1 (N >= X >=1). 
Checkpoint 0 (the first one) will allow 2^(N-1) to pass simultaneously through it.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>

typedef struct {
    int id, N;
    pthread_mutex_t *mutexes;
    pthread_barrier_t *barrier;
} data;

void *f(void *arg) {
    data d = *((data*) arg);
    int i;
    printf("Thread %d is waiting...\n", d.id);
    pthread_barrier_wait(d.barrier);
    for (i = 0; i < d.N; i++) {
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
    if (argc != 2) {
        printf("Please provide 1 argument!\n");
        exit(1);
    }
    int N = atoi(argv[1]);
    pthread_t *T = malloc(sizeof(pthread_t) * (1 << N));
    data *args = malloc(sizeof(data) * (1 << N));
    pthread_mutex_t *mutexes = malloc(sizeof(pthread_mutex_t) * N);
    pthread_barrier_t barrier;
    pthread_barrier_init(&barrier, NULL, (1 << N));
    int i;
    for (i = 0; i < N; i++) {
        pthread_mutex_init(&mutexes[i], NULL);
    }
    for (i = 0; i < (1 << N); i++) {
        args[i].id = i;
        args[i].N = N;
        args[i].mutexes = mutexes;
        args[i].barrier = &barrier;
        pthread_create(&T[i], NULL, f, &args[i]);
    }
    wait_threads(T, (1 << N));
    destroy_mutexes(mutexes, N);
    cleanup(T, args, mutexes);
    pthread_barrier_destroy(&barrier);
    return 0;
}