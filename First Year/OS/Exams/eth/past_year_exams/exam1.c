/*
Write a c program that receives pairs of integer numbers as command line arguments. 

The second number in the pair represents an index between 0 and the total number of pairs, all the indexes given will be unique.

For each pair the program will create a thread, each thread will be indexed starting from 0 in the order in which they are created. 

Each thread will receive as argument one of the pairs given as command line argument. 

Each thread will add to an integer global variable the value of the first number of the pair it received as command line argument. 

If the global variable is an even number after the addition the next thread that will add to the variable will be the thread 
with the index equal to the index received by the last thread that added to the variable, otherwise any other thread can add to the global variable.

The execution will end after the global variable exceeds a predetermined value.

The threads must be dynamically allocated in memory.

The access to the critical resources must be efficiently synchronized (aka the wait time of each thread must be minimum).

NOTE: When you compile use the -pthread option.
The source file must be compiled using gcc with -Wall -g -pthread WITHOUT WARNINGS OR SYNTAX ERRORS!!!
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include "barrier.h"

#define TARGET 50 

typedef struct {
    int id;
    int value;
    int next;
} pthread_args_t;

int sum;
int turn = -1;
pthread_cond_t cond;
pthread_mutex_t mutex;

void *f(void* args) {
    pthread_args_t dt = *((pthread_args_t *) args);
   
    while(1){
        pthread_mutex_lock(&mutex);
        while(1){
            if(turn == -1){
                turn = dt.id;
            }
            if(turn == dt.id){
                break;
            }
            if(sum >= TARGET){
                break;
            }
            printf("Thread %d waits\n", dt.id); 
            pthread_cond_wait(&cond, &mutex);
            printf("Thread %d done waiting\n", dt.id); 
        }
        if(sum >= TARGET){
            break;
        }
        sum += dt.value;
        printf("Thread %d adds to the sum %d, the new sum is %d\n", dt.id, dt.value, sum);
        if(sum % 2 == 0){
            turn = dt.next;           
        } else {
            turn = -1;
        }  
        printf("Next thread to execute should be %d\n", turn);
        pthread_cond_broadcast(&cond);
        pthread_mutex_unlock(&mutex);     
    }
    pthread_mutex_unlock(&mutex);
    return NULL;
}

int main(int argc, char* argv[]) {
    if (argc < 2){
        perror("Invalid number of arguments!\n");
        exit(1);
    }

    int th_num = (argc - 1)/2;

    pthread_t *th = (pthread_t*)malloc(sizeof(pthread_t) * th_num); 
    pthread_args_t *args = (pthread_args_t*)malloc(sizeof(pthread_args_t) * th_num); 

    pthread_mutex_init(&mutex, NULL);
    pthread_cond_init(&cond, NULL);

    for(int i = 1; i < argc; i+=2){
        args[(i - 1) / 2].id = (i - 1) / 2;
        args[(i - 1) / 2].value = atoi(argv[i]);
        args[(i - 1) / 2].next = atoi(argv[i + 1]);
        if(0 != pthread_create(&th[(i - 1) / 2], NULL, f, (void *) &args[(i - 1) / 2])){ 
            perror("Cannot create thread!\n");
            exit(1);
        }
    }

    for(int i = 1; i < argc; i+=2){
        if(0 != pthread_join(th[(i - 1) / 2], NULL)){ 
            perror("Cannot join thread");
            exit(1);
        }
    }

    pthread_cond_destroy(&cond);
    pthread_mutex_destroy(&mutex);  
    free(args);
    free(th);
    
    printf("Sum is: %d\n", sum);

    return 0;
}



