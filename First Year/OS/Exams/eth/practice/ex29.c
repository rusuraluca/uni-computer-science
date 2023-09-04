/*
29. Write a C program that reads a number n from standard input and creates n threads, numbered from 0 to n - 1. 
Each thread places a random number between 10 and 20 on the position indicated by its id in an array of integers. 
After all threads have placed their number in the array, each thread repeats the following:
- Checks if the number on its own position is greater than 0.
- If yes, it subtracts 1 from all numbers of the array, except the one on its own position.
- If not, the thread terminates.
- If there are no numbers in the array that are greater than 0, except the number on the thread's index position, the thread terminates.
After all threads terminate, the main process prints the array of integers. Use appropriate synchronization mechanisms.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include "barrier.h"

typedef struct {
    int id;
    int n;
    int *arr;
    pthread_mutex_t *mutex;
    pthread_barrier_t *barrier;
} thread_arg_t;


void *f(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);

    pthread_mutex_lock(dt.mutex);        
    dt.arr[dt.id] = 10 + rand() % 10;
    pthread_mutex_unlock(dt.mutex);     
        
    pthread_barrier_wait(dt.barrier);

    for (int i = 0; i < dt.n; i++) {
        printf("%d ", dt.arr[i]);
    }
    printf("\n");

    while (1) {
        pthread_mutex_lock(dt.mutex);        
        if (dt.arr[dt.id] > 0) {
            for (int i = 0; i < dt.n; i++) {
                if (i != dt.id) {
                    dt.arr[i]--;
                }
            }
        } else {
            pthread_mutex_unlock(dt.mutex);
            break;
        }
        int ok = 0;
        for (int i = 0; i < dt.n; i++) {
            if (i != dt.id && dt.arr[i] > 0) {
                ok = 1;
                break;
            }
        }
        if (!ok) {
            pthread_mutex_unlock(dt.mutex);
            break;
        }
        pthread_mutex_unlock(dt.mutex);
    }

    return NULL;
}

int main(int argc, char *argv[]) {
    int n;
    printf("n=");
    scanf("%d", &n);

    int *arr = malloc(sizeof(int) * n);

    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    pthread_barrier_t *barrier = malloc(sizeof(pthread_barrier_t));
    pthread_barrier_init(barrier, NULL, n);

    pthread_t *th = malloc(sizeof(pthread_t) * n);
    thread_arg_t *args = malloc(sizeof(thread_arg_t) * n);

    for (int i = 0; i < n; i++) {
        args[i].id = i;
        args[i].n = n;
        args[i].mutex = mutex;
        args[i].barrier = barrier;
        args[i].arr = arr;
        pthread_create(&th[i], NULL, f, (void*) &args[i]);
    }

    for (int i = 0; i < n; i++) {
        pthread_join(th[i], NULL);
    }

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    free(mutex);
    pthread_mutex_destroy(mutex);   
    free(arr);
    free(th);
    free(args);
    free(barrier);
    pthread_barrier_destroy(barrier);

    return 0;
}