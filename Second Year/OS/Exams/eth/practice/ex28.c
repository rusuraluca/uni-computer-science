/*
28. Write a C program that reads a number n from standard input and generates an array s of n random integers between 0 and 1000. After the array is created, the main process creates n + 1 threads. Each of the first n threads repeats the following steps until the array is sorted in ascending order:
- generates 2 random integers between 0 and n-1, called i and j
- if i < j and s[i] > s[j], exchanges the values of s[i] and s[j]
- if i > j and s[i] < s[j], exchanges the values of s[i] and s[j]
The n+1th thread waits until the array is sorted, after which it prints it to the console. Use appropriate synchronization mechanisms.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

typedef struct {
    int *arr;
    int n;
    int *sorted;
    pthread_mutex_t *mutex;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
    int i, j;
    while (1) {
        pthread_mutex_lock(dt.mutex);
        if (*(dt.sorted) == 1) {
            pthread_mutex_unlock(dt.mutex);
            break;
        }
        i = rand() % dt.n;
        j = rand() % dt.n;
        if (i < j && dt.arr[i] > dt.arr[j]) {
            int aux = dt.arr[i];
            dt.arr[i] = dt.arr[j];
            dt.arr[j] = aux;
        }
        if (i > j && dt.arr[i] < dt.arr[j]) {
            int aux = dt.arr[i];
            dt.arr[i] = dt.arr[j];
            dt.arr[j] = aux;
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
    int *sorted = malloc(sizeof(int));
    *sorted = 0;
    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    pthread_t *th = malloc((n + 1) * sizeof(pthread_t));
    thread_arg_t *args = malloc((n + 1) * sizeof(thread_arg_t));
    for (int i = 0; i < n; i++)
        arr[i] = rand() % 1000;
    for (int i = 0; i < n; i++) {
        args[i].arr = arr;
        args[i].n = n;
        args[i].sorted = sorted;
        args[i].mutex = mutex;
        pthread_create(&th[i], NULL, func, &args[i]);
    }
    args[n].arr = arr;
    args[n].n = n;
    args[n].sorted = sorted;
    args[n].mutex = mutex;
    pthread_create(&th[n], NULL, func, &args[n]);

    for (int i = 0; i < n + 1; i++)
        pthread_join(th[i], NULL);

    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\n");

    return 0;
}