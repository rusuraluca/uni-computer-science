/*
30. Relay: Create a C program that reads a number n from the standard input and created 4 * n threads. 
The threads will be split into teams of 4. In each team the threads will be numbered from 0 and will run according to the relay rules:
- Thread 0 from each theam starts, waits (usleep) for 100 and 200 milliseconds, then passes the control to thread 1
- Thread 1 waits between 100 and 200 milliseconds then passes the control to thread 2
- Thread 2 waits between 100 and 200 milliseconds then passes the control to thread 3
- Thread 3 waits between 100 and 200 milliseconds, then prints a message indicating that the team has finished, then terminates
The team from which thread 3 terminates first is considered the winning team. Use appropriate synchronization mechanisms.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

typedef struct {
    int id;
    int *finished;
    pthread_mutex_t *mutex;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
    int i;
    for (i = 0; i < 4; i++) {
        pthread_mutex_lock(dt.mutex);
        if (*(dt.finished) == 1) {
            pthread_mutex_unlock(dt.mutex);
            break;
        }
        if (dt.id == i) {
            printf("Thread %d from team %d\n", dt.id, dt.id / 4);
            usleep(100000 + rand() % 100000);
            if (dt.id == 3) {
                printf("Team %d finished\n", dt.id / 4);
                *(dt.finished) = 1;
            }
        }
        pthread_mutex_unlock(dt.mutex);
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Please provide at least one argument.\n");
        exit(1);
    }

    int n = atoi(argv[1]);
    int *finished = malloc(sizeof(int));
    *finished = 0;
    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    pthread_t *th = malloc((4 * n) * sizeof(pthread_t));
    thread_arg_t *args = malloc((4 * n) * sizeof(thread_arg_t));
    int i;
    for (i = 0; i < 4 * n; i++) {
        args[i].id = i;
        args[i].finished = finished;
        args[i].mutex = mutex;
        pthread_create(&th[i], NULL, func, &args[i]);
    }

    for (i = 0; i < 4 * n; i++) {
        pthread_join(th[i], NULL);
    }

    pthread_mutex_destroy(mutex);
    free(mutex);
    free(finished);
    free(th);
    free(args);
    return 0;
}