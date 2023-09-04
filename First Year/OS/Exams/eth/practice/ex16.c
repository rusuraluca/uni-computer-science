/*
Write a C program that receives integers as command line argument. 
The program will keep a frequency vector for all digits. 
The program will create a thread for each argument that counts the number of occurrences of each digit and adds the result to the frequency vector. 
Use efficient synchronization.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <ctype.h>

typedef struct {
    int *freq;
    pthread_mutex_t *mutexes;
    int nr;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
    int i, nr = dt.nr;
    while (nr > 0) {
        pthread_mutex_lock(&dt.mutexes[nr % 10]);
        dt.freq[nr % 10]++;
        pthread_mutex_unlock(&dt.mutexes[nr % 10]);
        nr /= 10;
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Please provide at least one argument.\n");
        exit(1);
    }

    int *freq = calloc(10, sizeof(int));
    pthread_mutex_t *mutexes = malloc(10 * sizeof(pthread_mutex_t));
    for (int i = 0; i < 10; i++)
        pthread_mutex_init(&mutexes[i], NULL);

    pthread_t *th = malloc((argc - 1) * sizeof(pthread_t));
    thread_arg_t *args = malloc((argc - 1) * sizeof(thread_arg_t));
    for (int i = 0; i < argc - 1; i++) {
        args[i].freq = freq;
        args[i].mutexes = mutexes;
        args[i].nr = atoi(argv[i + 1]);
        pthread_create(&th[i], NULL, func, &args[i]);
    }

    for (int i = 0; i < argc - 1; i++)
        pthread_join(th[i], NULL);

    for (int i = 0; i < 10; i++)
        printf("%d ", freq[i]);
    printf("\n");

    free(freq);
    free(mutexes);
    free(th);
    free(args);
    return 0;
}