/*
31. Write a C program that receives a number N as a command-line argument. 
The program creates N threads that will generate random numbers between 0 and 111111 (inclusive) until one thread generates a number divisible by 1001.
The threads will display the generated numbers, but the final number that is displayed must be the one that is divisible by 1001. 
No thread will start generating random numbers until all threads have been created. Do not use global variables.
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include "barrier.h"

#define MAX 111111

typedef struct {
    int id;
    int *n;
    int *flag;
    pthread_mutex_t *mutex;
    pthread_barrier_t *barrier;
} thread_arg_t;


void *f(void *arg){
    thread_arg_t dt = *((thread_arg_t *) arg);
    printf("Thread %d created\n", dt.id);

    pthread_barrier_wait(dt.barrier);

    printf("Thread %d started\n", dt.id);

    while(1){
        pthread_mutex_lock(dt.mutex);

        if(*(dt.n) % 1001 == 0){
            pthread_mutex_unlock(dt.mutex);
            break;
        }

        *(dt.n) = (rand() % MAX);
        printf("Thread %d n: %d\n", dt.id, *(dt.n));

        pthread_mutex_unlock(dt.mutex);
    }

    printf("Thread %d ended\n", dt.id);

    return NULL;
}

int main(int argc, char *argv[]){
    if (argc < 2){
        perror("Provide the number of threads\n");
        exit(1);
    }

    int n = 1;
    int th_nr = atoi(argv[1]);

    pthread_t *th = malloc(sizeof(pthread_t) * th_nr);
    thread_arg_t *args = malloc(sizeof(thread_arg_t) * th_nr);
    pthread_mutex_t mtx;
    pthread_mutex_init(&mtx, NULL);
    pthread_barrier_t barrier;
    pthread_barrier_init(&barrier, NULL, th_nr);

    for(int i = 0; i < th_nr; ++i){
        args[i].id = i;
        args[i].n = &n;
        args[i].mutex = &mtx;
        args[i].barrier = &barrier;   
        if(0 != pthread_create(&th[i], NULL, f, (void *) &args[i])){
            perror("Cannot create thread");
            exit(1);
        }
    }

    for(int i = 0; i < th_nr; ++i){
        if(0 != pthread_join(th[i], NULL)){
            perror("Cannot join thread\n");
            exit(1);
        }
    }

    pthread_mutex_destroy(&mtx);
    pthread_barrier_destroy(&barrier);
    free(th);
    free(args);

    printf("n = %d\n", n);

    return 0;
}
