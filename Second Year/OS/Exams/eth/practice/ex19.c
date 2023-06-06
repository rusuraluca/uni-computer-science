/*
 Create a C program that takes one integer N as a command line argument, and then reads N integers from the keyboard and stores them in an array. 
 It then calculates the sum of all the read integers using threads that obey the hierarchy presented in the image below. 
 For any given N, the array has to be padded with extra integers with value 0 to ensure that it always contains a number of elements equal to a power of 2 
 (let this number be M). 
 The required number of threads will be M - 1, let each thread have and ID from 1 to M - 1. 
 As per the image, threads with ID >= M / 2 will calculate the sum of 2 numbers on consecutive positions in the array. 
 Threads with an ID < M / 2 must wait for 2 threads to finish and then they will add the results produced by those two threads.
*/

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <ctype.h>

int *arr;
int n;

void *f(void *arg){
    int id = *(int *) arg;
    int left = 2 * id;
    int right = 2 * id + 1;
    if(left < n){
        if(right < n){
            arr[id] = arr[left] + arr[right];
        } else {
            arr[id] = arr[left];
        }
    }
    return NULL;
}

int main(int argc, char *argv[]){
    if (argc < 2){
        printf("Provide one argument!\n");
        exit(1);
    }

    n = atoi(argv[1]);
    int m = 1;
    while(m < n){
        m *= 2;
    }
    arr = malloc(sizeof(int) * m);
    for(int i = 0; i < n; ++i){
        scanf("%d", &arr[i]);
    }
    for(int i = n; i < m; ++i){
        arr[i] = 0;
    }

    pthread_t *th = malloc(sizeof(pthread_t) * (m - 1));
    int *ids = malloc(sizeof(int) * (m - 1));
    for(int i = 0; i < m - 1; ++i){
        ids[i] = i + 1;
    }

    for(int i = 0; i < m - 1; ++i) {
        if(0 != pthread_create(&th[i], NULL, f, &ids[i])){ 
            perror("Cannot create thread");
            exit(1);
        }
    }

    for(int i = 0; i < m - 1; ++i) {
        pthread_join(th[i], NULL); 
    }

    free(th);
    free(ids);

    printf("Sum = %d\n", arr[0]);
    free(arr);
    return 0;
}