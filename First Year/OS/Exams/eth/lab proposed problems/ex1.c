/*
Write a C program that creates three threads. The threads will keep adding random numbers
between -500 and +500 to a shared variable that initially has the value 0. The threads will
terminate when the shared variable has an absolute value greater than 500.
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include "barrier.h"

typedef struct {
    int id;
    int *n;
    pthread_mutex_t *mutex;
    pthread_barrier_t *barrier;
} thread_arg_t;


void *f(void *arg){
    thread_arg_t dt = *((thread_arg_t *) arg);
    printf("Thread %d started\n", dt.id);

    pthread_barrier_wait(dt.barrier);

    while(1){
        pthread_mutex_lock(dt.mutex);

        if(abs(*(dt.n)) > 500){
            pthread_mutex_unlock(dt.mutex);
            break;
        }

        *(dt.n) = *(dt.n) + ((rand() % 1000) - 500);
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

    int n = 0;
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
