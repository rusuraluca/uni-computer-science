/*
27. Write a C program that takes two numbers, N and M, as arguments from the command line. 
The program creates N "generator" threads that generate random lowercase letters and append them to a string with 128 positions.
The program will create an additional "printer" thread that that waits until all the positions of the string are filled, 
at which point it prints the string and clears it. 
The N "generator" threads must generate a total of M such strings and the "printer" thread prints each one as soon as it gets to length 128.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <ctype.h>

typedef struct {
    char *str;
    int *len;
    int *max;
    pthread_mutex_t *mutex;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
    int i;
    while (1) {
        pthread_mutex_lock(dt.mutex);
        if (*(dt.len) >= *(dt.max)) {
            pthread_mutex_unlock(dt.mutex);
            break;
        }
        for (i = 0; i < *(dt.len); i++)
            printf("%c", dt.str[i]);
        printf("\n");
        *(dt.len) = 0;
        pthread_mutex_unlock(dt.mutex);
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Please provide at least two arguments.\n");
        exit(1);
    }

    char *str = malloc(128 * sizeof(char));
    int *len = malloc(sizeof(int));
    *len = 0;
    int *max = malloc(sizeof(int));
    *max = atoi(argv[1]);
    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    pthread_t *th = malloc(atoi(argv[1]) * sizeof(pthread_t));
    thread_arg_t *args = malloc(atoi(argv[1]) * sizeof(thread_arg_t));
    for (int i = 0; i < atoi(argv[1]); i++) {
        args[i].str = str;
        args[i].len = len;
        args[i].max = max;
        args[i].mutex = mutex;
        if (0 != pthread_create(&th[i], NULL, func, &args[i])) {
            perror("Cannot create thread");
            exit(1);
        }
    }

    for (int i = 0; i < atoi(argv[1]); i++)
        pthread_join(th[i], NULL);

    free(th);
    free(args);
    free(str);
    free(len);
    free(max);
    free(mutex);
    return 0;
}