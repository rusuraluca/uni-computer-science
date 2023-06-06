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

typedef struct {
    int *arr;
    int n;
    int id;
    pthread_mutex_t *mutex;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
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
    if (argc < 2) {
        printf("Please provide at least one argument.\n");
        exit(1);
    }

    int n = atoi(argv[1]);
    int *arr = malloc(n * sizeof(int));
    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    pthread_t *th = malloc(n * sizeof(pthread_t));
    thread_arg_t *args = malloc(n * sizeof(thread_arg_t));

    for (int i = 0; i < n; i++) {
        args[i].arr = arr;
        args[i].n = n;
        args[i].id = i;
        args[i].mutex = mutex;
        pthread_create(&th[i], NULL, func, &args[i]);
    }

    for (int i = 0; i < n; i++) {
        pthread_join(th[i], NULL);
    }

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    free(arr);
    free(mutex);
    free(th);
    free(args);

    return 0;
}