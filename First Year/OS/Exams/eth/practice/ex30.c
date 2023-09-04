/*
30. Relay: Create a C program that reads a number n from the standard input and created 4 * n threads. 
The threads will be split into teams of 4. In each team the threads will be numbered from 0 and will run according to the relay rules:
- Thread 0 from each team starts, waits (usleep) for 100 and 200 milliseconds, then passes the control to thread 1
- Thread 1 waits between 100 and 200 milliseconds then passes the control to thread 2
- Thread 2 waits between 100 and 200 milliseconds then passes the control to thread 3
- Thread 3 waits between 100 and 200 milliseconds, then prints a message indicating that the team has finished, then terminates
The team from which thread 3 terminates first is considered the winning team. Use appropriate synchronization mechanisms.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include "barrier.h"

typedef struct {
    int id;
    int team;
    int *finished;
    pthread_mutex_t *mutex;
    pthread_barrier_t *barrier;
    pthread_cond_t *cond;
} thread_arg_t;

void *f(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);

    printf("Thread %d from team %d created\n", dt.id, dt.team);   
    pthread_barrier_wait(dt.barrier);

    for (int i = 0; i < 4; i++) {
        pthread_mutex_lock(dt.mutex);
        
        usleep(100000 + rand() % 100000);

        printf("Thread %d from team %d\n", dt.id, dt.team);

        if (i == 3){
            printf("Team %d finished\n", dt.team);
            *(dt.finished) = 1;
            pthread_cond_broadcast(dt.cond);
            pthread_mutex_unlock(dt.mutex);
            break;
        }

        pthread_mutex_unlock(dt.mutex);

        while (*(dt.finished) != 1) {
            pthread_cond_wait(dt.cond, dt.mutex);
        }
    }

    pthread_mutex_unlock(dt.mutex);

    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Invalid no of args.\n");
        exit(1);
    }

    int n = atoi(argv[1]);
    int *finished = malloc(sizeof(int));
    *finished = 0;

    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

        pthread_cond_t *cond = malloc(sizeof(pthread_cond_t));
    pthread_cond_init(cond, NULL);

    pthread_barrier_t *barrier = malloc(sizeof(pthread_barrier_t));
    pthread_barrier_init(barrier, NULL, 4 * n);

    pthread_t *th = malloc((4 * n) * sizeof(pthread_t));
    thread_arg_t *args = malloc((4 * n) * sizeof(thread_arg_t));

    for (int i = 0; i < 4 * n; i++) {
        args[i].id = i % 4;
        args[i].team = i / 4;
        args[i].finished = finished;
        args[i].mutex = mutex;
        args[i].barrier = barrier;
        args[i].cond = cond;
        pthread_create(&th[i], NULL, f, &args[i]);
    }

    for (int i = 0; i < 4 * n; i++) {
        pthread_join(th[i], NULL);
    }

    pthread_mutex_destroy(mutex);
    pthread_barrier_destroy(barrier);
    pthread_cond_destroy(cond);
    free(mutex);
    free(barrier);
    free(cond); 
    free(finished);
    free(th);
    free(args);
    return 0;
}