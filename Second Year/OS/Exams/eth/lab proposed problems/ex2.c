/*
Write a C program that receives strings containing any characters as command-line arguments. 
The program will create a frequency vector for all lowercase letters of the alphabet.
The program will create a thread for each command-line argument, 
each thread will update the letter frequency vector based on the characters present in its corresponding command-line argument. 
Use efficient synchronization.



char var tar

t1 => char
t2 => var
t3 => tar
*/


#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include "barrier.h"
#include <string.h>

typedef struct {
    int id;
    char *str;
    int *freq;
} thread_arg_t;

pthread_mutex_t mutex;

void *f(void *arg){
    thread_arg_t dt = *((thread_arg_t *) arg);
    printf("Thread %d started\n", dt.id);
    for(int i = 0; i < strlen(dt.str); ++i){
        if(dt.str[i] >= 'a' && dt.str[i] <= 'z'){
            pthread_mutex_lock(&mutex);
            dt.freq[dt.str[i] - 'a']++;
            pthread_mutex_unlock(&mutex);
        }
    }
    printf("Thread %d ended\n", dt.id);
    return NULL;
}


int main(int argc, char* argv[]){
    if(argc < 2){
        perror("Invalid no of arguments\n");
        exit(1);
    }

    int th_nr = argc - 1;
    int *freq = malloc(26 * sizeof(int));
    memset(freq, 0, 26 * sizeof(int));

    pthread_t *th = (pthread_t *)malloc(sizeof(pthread_t) * th_nr);
    thread_arg_t *args = (thread_arg_t *)malloc(sizeof(thread_arg_t) * th_nr);
    pthread_mutex_init(&mutex, NULL);

    for(int i = 0; i < th_nr; ++i){
        args[i].id = i;
        args[i].str = argv[i+1];
        args[i].freq = freq;
        if(0 != pthread_create(&th[i], NULL, f, (void *) &args[i])){
            perror("Cannot create thread");
            exit(1);
        }
    }

    for(int i = 0; i < th_nr; ++i){
        if(0 != pthread_join(th[i], NULL)){
            perror("Cannot join thread");
            exit(1);
        }
    }

    for(int i = 0; i < 26; ++i){
        printf("%c: %d\n", 'a' + i, freq[i]);
    }

    pthread_mutex_destroy(&mutex);
    free(th);
    free(args);

    return 0;
}
