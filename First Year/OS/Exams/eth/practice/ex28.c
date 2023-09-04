/*
28. Write a C program that reads a number n from standard input and generates an array s of n random integers between 0 and 1000. 
After the array is created, the main process creates n + 1 threads. 
Each of the first n threads repeats the following steps until the array is sorted in ascending order:
- generates 2 random integers between 0 and n-1, called i and j
- if i < j and s[i] > s[j], exchanges the values of s[i] and s[j]
- if i > j and s[i] < s[j], exchanges the values of s[i] and s[j]
The n+1 th thread waits until the array is sorted, after which it prints it to the console. Use appropriate synchronization mechanisms.
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
} pthread_args_t;

void* f(void* args){
    pthread_args_t dt = *((pthread_args_t *) args);

    if(dt.id != dt.n){
        while(1){
            int i = rand() % dt.n;
            int j = rand() % dt.n;
            if(i < j){
                pthread_mutex_lock(dt.mutex);
                if(dt.arr[i] > dt.arr[j]){
                    int aux = dt.arr[i];
                    dt.arr[i] = dt.arr[j];
                    dt.arr[j] = aux;
                }
                pthread_mutex_unlock(dt.mutex);
            }
            if(i > j){
                pthread_mutex_lock(dt.mutex);
                if(dt.arr[i] < dt.arr[j]){
                    int aux = dt.arr[i];
                    dt.arr[i] = dt.arr[j];
                    dt.arr[j] = aux;
                }
                pthread_mutex_unlock(dt.mutex);
            }

            int ok = 1;
            for(int i = 0; i < dt.n - 1; ++i){
                pthread_mutex_lock(dt.mutex);
                if(dt.arr[i] > dt.arr[i + 1]){
                    ok = 0;
                    pthread_mutex_unlock(dt.mutex);
                    break;
                }
                pthread_mutex_unlock(dt.mutex);
            }
            if(ok){
                break;
            }
        }
    }
    else {
        pthread_mutex_lock(dt.mutex);
        for(int i = 0; i < dt.n; ++i){
            printf("%d ", dt.arr[i]);
        }
        printf("\n");
        pthread_mutex_unlock(dt.mutex);
    }

    return NULL;
} 

int main(int argc, char* argv[]){
    int n = 0;
    printf("n=");
    scanf("%d", &n);

    int *arr = malloc(sizeof(int) * n);
    for(int i = 0; i < n; ++i){
        arr[i] = rand() % 1000;
    }

    for(int i = 0; i < n; ++i){
        printf("%d ", arr[i]);
    }
    printf("\n");

    pthread_t *th = (pthread_t *)malloc(sizeof(pthread_t) * n);
    pthread_args_t *args = (pthread_args_t *)malloc(sizeof(pthread_args_t) * n);

    pthread_mutex_t *mutex = (pthread_mutex_t *)malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    for(int i = 0; i <= n; i++){
        args[i].id = i;
        args[i].arr = arr;
        args[i].n = n;
        args[i].mutex = mutex;
        if(0 < pthread_create(&th[i], NULL, f, (void *)&args[i])){
            perror("Cannot create thread\n");
            exit(1);
        }
    }

    for(int i = 0; i < n; i++){
        if(0 < pthread_join(th[i], NULL)){
            perror("Cannot join thread\n");
            exit(1);
        }
    }

    free(args);
    free(th);
    free(mutex);
    pthread_mutex_destroy(mutex);
    free(arr);

    return 0;
}