/*
Write a C program that takes as command-line arguments 2 numbers: N and M.
The program will create N threads and simulate a race where each thread must pass through the M checkpoints.
Through each checkpoint, the threads must pass one at a time (no 2 threads can be inside the same checkpoint at the same time).
Each thread that enters a checkpoint will wait a random amount of time between 100 and 200 milliseconds 
(usleep(100000) makes a thread or process wait for 100 milliseconds) and will print a message indicating the thread number and the check point number,
then it will exit the checkpoint. 
Ensure that each thread waits until all threads have been created before starting the race.

-> barrier at n because all threads must start at the same time
-> mutex at each checkpoint because only one thread can be inside a checkpoint at a time
*/
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include "barrier.h"


typedef struct {
    int id;
} pthread_args_t;


int n, m;
pthread_barrier_t barrier;
pthread_mutex_t mutex;


void* f(void* args){
    pthread_args_t dt = *((pthread_args_t *) args);

    printf("Thread %d started\n", dt.id);

    pthread_barrier_wait(&barrier);

    for(int i = 1; i <= m; ++i){
        pthread_mutex_lock(&mutex);
        usleep(100000);
        printf("Thread %d passed checkpoint %d\n", dt.id, i);
        pthread_mutex_unlock(&mutex);
    }

    printf("Thread %d finished\n", dt.id);

    return NULL;
}


int main(int argc, char* argv[]){
    if(argc < 2){
        perror("Invalid no of args\n");
        exit(1);
    }

    n = atoi(argv[1]);
    m = atoi(argv[2]);

    pthread_t *th = (pthread_t *)malloc(sizeof(pthread_t) * n);
    pthread_args_t *args = (pthread_args_t *)malloc(sizeof(pthread_args_t) * n);
    
    pthread_barrier_init(&barrier, NULL, n);
    pthread_mutex_init(&mutex, NULL);

    for(int i = 0; i < n; ++i){
        args[i].id = i;
        if(0 < pthread_create(&th[i], NULL, f, (void *) &args[i])){
            perror("Cannot create thread\n");
            exit(1);
        }
    }

    for(int i = 0 ; i < n; ++i){
        if(0 < pthread_join(th[i], NULL)){
            perror("Cannot join thread\n");
            exit(1);
        }
    }

    pthread_barrier_destroy(&barrier);
    pthread_mutex_destroy(&mutex);
    free(th);
    free(args);

    return 0;
}