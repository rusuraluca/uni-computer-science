/*
31. Write a C program that receives a number N as a command-line argument. 
The program creates N threads that will generate random numbers between 0 and 111111 (inclusive) until one thread generates a number divisible by 1001.
The threads will display the generated numbers, but the final number that is displayed must be the one that is divisible by 1001. 
No thread will start generating random numbers until all threads have been created. Do not use global variables.
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
    if (N < 1) {
        printf("Please provide a positive number!\n");
        exit(2);
    }
    srand(time(NULL));
    pthread_t *T = malloc(N * sizeof(pthread_t));
    data *args = malloc(N * sizeof(data));
    pthread_mutex_t *mutexes = malloc(N * sizeof(pthread_mutex_t));
    pthread_barrier_t barrier;
    pthread_barrier_init(&barrier, NULL, N);
    int i;
    for (i = 0; i < N; i++) {
        pthread_mutex_init(&mutexes[i], NULL);
        args[i].id = i;
        args[i].N = N;
        args[i].mutexes = mutexes;
        args[i].barrier = &barrier;
        pthread_create(&T[i], NULL, f, &args[i]);
    }
    wait_threads(T, N);
    destroy_mutexes(mutexes, N);
    cleanup(T, args, mutexes);
    return 0;
}

