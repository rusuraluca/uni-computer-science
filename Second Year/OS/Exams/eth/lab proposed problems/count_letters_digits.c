/*
Write a c program using threads that receives as command line arguments the name of a file and the number of threads to create in order to calculate the number of letters and digits in the file.
*/
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include "barrier.h"


int count_letters;
int count_digits;
pthread_mutex_t mutex;

void* f(void* args){
    FILE *f = fopen((char*)args, "r");
    char c;
    int local_letters = 0;
    int local_digits = 0;   

    while(fscanf(f, "%c", &c) == 1){
        if('0' <= c && c <= '9'){
            local_digits++;
        }
        if('a' <= c && c <= 'z'){
            local_letters++;
        }
        if('A' <= c && c <= 'Z'){
            local_letters++;
        }
    }

    fclose(f);

    pthread_mutex_lock(&mutex);
    count_letters += local_letters;
    count_digits += local_digits;
    pthread_mutex_unlock(&mutex);

    return NULL;
}

int main(int argc, char** argv){
    if(argc < 2){
        perror("Invalid no of args\n");
        exit(1);
    }

    pthread_t *th = (pthread_t *)malloc(sizeof(pthread_t) * (argc-1));
    pthread_mutex_init(&mutex, NULL);

    for(int i = 1; i < argc; i++){
        if(0 != pthread_create(&th[i-1], NULL, f, (void *)argv[i])){ 
            perror("Cannot create thread!\n");
            exit(1);
        }
    }

    for(int i = 1; i < argc; i++){
        if(0 != pthread_join(th[i-1], NULL)){ 
            perror("Cannot join thread!\n");
            exit(1);
        }
    }

    pthread_mutex_destroy(&mutex);  
    free(th);

    printf("Letters: %d\n", count_letters);
    printf("Digits: %d\n", count_digits);

    return 0;
}


