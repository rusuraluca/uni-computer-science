/*
Write a C program that reads a number N and creates 2 threads. 
One of the threads will generate an even number and will append it to an array that is passed as a parameter to the thread. 
The other thread will do the same, but using odd numbers. 
Use mutexes and condition variables between the two threads so that they alternate in appending numbers to the array, until they reach the maximum length N.
*/

#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>

// will pass all the data as a thread argument
// global variables might be easier
typedef struct {
    pthread_mutex_t *mutex;
    pthread_cond_t *cond;
    int *arr, *index;
    int n;
} data; 

// Thread 1 -> puts even numbers on even positions
// This thread must add the first element
void *f1(void *arg) {
    data d = *((data *) arg);
    int i;
    // pthread_cond_wait needs a LOCKED mutex in order to function properly
    // so we lock the mutex first
    // also, we are reading the value of the index variable, which can be modified by either thread
    // so we have extra reason to lock the mutex
    pthread_mutex_lock(d.mutex);
    while (*(d.index) % 2 != 0) 
        pthread_cond_wait(d.cond, d.mutex);
    // pthread_cond_wait does the following:
    // 1. sets up a listener that reacts to a signal sent by pthread_cond_signal or pthread_cond_broadcast
    // 2. unlocks the provided mutex -> allows other threads to acquire the mutex and do work
    // 3. waits for the signal to wake up
    // 4. upon receiving a signal, it performs a pthread_mutex_lock on the provided mutex -> the thread will remain stuck here until the mutex is available

    // When we are entering the while loop we are guaranteed to have a locked mutex
    while (*(d.index) < d.n) {
        // add number and print array
        int nr = (random() % 51) * 2;
        d.arr[*(d.index)] = nr;
        *(d.index) += 1;

        printf("T1: ");
        for (i = 0; i < *(d.index); i++) {
            printf("%d ", d.arr[i]);
        }
        printf("\n");
        
        // the current thread is done with one loop, it must now signal the other thread so it can do work
        pthread_cond_signal(d.cond);
        // at this point, the other thread is trying to lock the mutex, due to pthread_cond_wait
        // so we need to unlock the mutex in the current thread, which is also done by pthread_cond_wait
        while (*(d.index) % 2 != 0 && *(d.index) < d.n) 
            pthread_cond_wait(d.cond, d.mutex);
    }
    // when exiting the loop, the other thread could still be waiting so we do one more pthread_cond_signal
    // and one more unlock, to ensure that the other thread can successfully exit from pthread_cond_wait
    pthread_cond_signal(d.cond);
    pthread_mutex_unlock(d.mutex);
    return NULL;
}

// Thread 2 -> puts odd numbers on odd positions
// The logic in this thread is nearly identical to the logic from f1, but here we generate odd numbers instead of even ones
// With a little effort, this problem can be solved using a single thread function rather than 2
void *f2(void *arg) {
    data d = *((data *) arg);
    int i;
    pthread_mutex_lock(d.mutex);
    while (*(d.index) % 2 != 1) pthread_cond_wait(d.cond, d.mutex);
    while (*(d.index) < d.n) {
        int nr = (random() % 50) * 2 + 1;
        d.arr[*(d.index)] = nr;
        *(d.index) += 1;

        printf("T2: ");
        for (i = 0; i < *(d.index); i++) {
            printf("%d ", d.arr[i]);
        }
        printf("\n");
        
        pthread_cond_signal(d.cond);
        while (*(d.index) % 2 != 1 && *(d.index) < d.n) pthread_cond_wait(d.cond, d.mutex);
    }
    pthread_cond_signal(d.cond);
    pthread_mutex_unlock(d.mutex);
    return NULL;
}

void init_arg(data *arg, pthread_mutex_t mutex, pthread_cond_t cond, int n, int *arr, int *index) {
    arg->mutex = &mutex;
    arg->cond = &cond;
    arg->arr = arr;
    arg->index = index;
    arg->n = n;
}

// main just initializes data and starts threads
int main(int argc, char *argv[]) {
    if(argc != 2) {
        printf("Please provide one command line argument!\n");
        exit(1);
    }
    srandom(time(NULL));
    int n = atoi(argv[1]);
    int *arr = malloc(sizeof(int) * n);
    int index = 0;
    pthread_mutex_t mutex;
    pthread_cond_t cond;
    pthread_mutex_init(&mutex, NULL);
    pthread_cond_init(&cond, NULL);

    pthread_t T[2];
    data args[2];
    init_arg(&args[0], mutex, cond, n, arr, &index);
    init_arg(&args[1], mutex, cond, n, arr, &index);
    
    // no checks done :'(
    pthread_create(&T[0], NULL, f1, (void *) &args[0]);
    pthread_create(&T[1], NULL, f2, (void *) &args[1]);

    pthread_join(T[0], NULL);
    pthread_join(T[1], NULL);

    pthread_mutex_destroy(&mutex);
    pthread_cond_destroy(&cond);

    free(arr);

    return 0;
}