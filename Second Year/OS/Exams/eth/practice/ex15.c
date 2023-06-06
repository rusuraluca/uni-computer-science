/*
15. Write a program that receives strings of characters as command line arguments. 
For each string the program creates a thread which calculates the number of digits, 
the number of leters and the number of special characters (anything other than a letter or digit). 
The main program waits for the threads to terminate and prints the total results (total number of digits, 
letters and special characters across all the received command line arguments) and terminates. Use efficient synchronization. 
Do not use global variables.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <ctype.h>

typedef struct {
    int *digits;
    int *letters;
    int *specials;
    pthread_mutex_t *mutexes;
    char *str;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
    int l = 0, d = 0, s = 0;
    int i, len = strlen(dt.str);
    for (i = 0; i < len; i++) {
        if ((dt.str[i] >= 'a' && dt.str[i] <= 'z') || (dt.str[i] >= 'A' && dt.str[i] <= 'Z'))
            l++;
        else if (dt.str[i] >= '0' && dt.str[i] <= '9')
            d++;
        else
            s++;
    }
    if (l > 0) {
        pthread_mutex_lock(&dt.mutexes[0]);
        *(dt.letters) += l;
        pthread_mutex_unlock(&dt.mutexes[0]);
    }
    if (d > 0) {
        pthread_mutex_lock(&dt.mutexes[1]);
        *(dt.digits) += d;
        pthread_mutex_unlock(&dt.mutexes[1]);
    }
    if (s > 0) {
        pthread_mutex_lock(&dt.mutexes[2]);
        *(dt.specials) += s;
        pthread_mutex_unlock(&dt.mutexes[2]);
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Please provide at least one argument.\n");
        exit(1);
    }

    int *letters = malloc(sizeof(int));
    int *digits = malloc(sizeof(int));
    int *specials = malloc(sizeof(int));
    pthread_t *thrds = malloc(sizeof(pthread_t) * (argc - 1));
    thread_arg_t *args = malloc(sizeof(thread_arg_t) * (argc - 1));
    pthread_mutex_t *mutexes = malloc(sizeof(pthread_mutex_t) * 3);
    int i;
    for (i = 0; i < 3; i++) {
        if (0 > pthread_mutex_init(&mutexes[i], NULL)) {
            perror("Error on creating mutexes");
            exit(1);
        }
    }
    *letters = 0;
    *digits = 0;
    *specials = 0;
    for (i = 0; i < argc - 1;i++) {
        args[i].letters = letters;
        args[i].digits = digits;
        args[i].specials = specials;
        args[i].mutexes = mutexes;
        args[i].str = argv[i+1];
        if (0 > pthread_create(&thrds[i], NULL, func, (void *) &args[i])) {
            perror("Error on create thread");
        }
    }

    for (i = 0; i < argc - 1;i++) {
        if (0 > pthread_join(thrds[i], NULL)) {
            perror("Error waiting for thread");
        }
    }

    printf("Total letters: %d\nTotal digits: %d\nTotal special characters: %d\n", *letters, *digits, *specials);
    for (i = 0; i < 3; i++) {
        pthread_mutex_destroy(&mutexes[i]);
    }
    free(args);
    free(thrds);
    free(mutexes);
    free(letters);
    free(digits);
    free(specials);
    return 0;
}