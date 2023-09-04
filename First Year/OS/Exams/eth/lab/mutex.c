#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

typedef struct {
    int id;
    int *n;
    pthread_mutex_t *mutex;
} thread_arg_t;

// void pointer (generic pointer) = can point to any data type
void *f(void *arg){
    //cast the argument
    thread_arg_t dt = *((thread_arg_t *) arg);
    printf("Thread %d started\n", dt.id);

    for(int i = 0; i < 1000; ++i) {
        pthread_mutex_lock(&dt.mutex);
       *(dt.n) = *(dt.n) + 1;
        pthread_mutex_unlock(&dt.mutex);
    }

    printf("Thread %d ended\n", dt.id);

    return NULL;
}

int main(int argc, char *argv[]){
    if (argc < 2){
        printf("Provide one argument!\n");
        exit(1);
    }

    int n=0;
    int th_nr = atoi(argv[1]);

    // create mutex
    pthread_mutex_t mtx;
    pthread_mutex_init(&mtx, NULL);

    // init threads & threads arguments
    pthread_t *th = malloc(sizeof(pthread_t) * th_nr); // pthread_t th[th_nr];
    thread_arg_t *args = malloc(sizeof(thread_arg_t) * th_nr);

    // create threads & pass arguments
    for(int i = 0; i < th_nr; ++i) {
        args[i].id = i;
        args[i].n = &n; 
        args[i].mutex = &mtx;   
        if(0 != pthread_create(&th[i], NULL, f, (void *) &args[i])){ // VOID * (*start_routine) (VOID *) is the function that the thread executes 
            perror("Cannot create thread");
            exit(1);
        }
    }

    // wait for threads to finish
     for(int i = 0; i < th_nr; ++i) {
        if(0 != pthread_join(th[i], NULL)){ 
            perror("Cannot join thread");
            exit(1);
        }
    }

    // destroy mutex
    pthread_mutex_destroy(&mtx);

    // free memory
    free(args);
    free(th);
    
    printf("n = %d\n", n);

    return 0;
}