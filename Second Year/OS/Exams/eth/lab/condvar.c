#define _XOPEN_SOURCE 600
// #define _POSIX_C_SOURCE 200112L
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

typedef struct {
    int id;
    int *n;
} thread_arg_t;

// void pointer (generic pointer) = can point to any data type
void *f(void *arg){
    //cast the argument
    thread_arg_t dt = *((thread_arg_t *) arg);
    printf("Thread %d started\n", dt.id);
    while(*(dt.n) < 500){
       
    }
    printf("n = %d\n", *(dt.n));
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

    // init threads & threads arguments
    pthread_t *th = malloc(sizeof(pthread_t) * th_nr); // pthread_t th[th_nr];
    thread_arg_t *args = malloc(sizeof(thread_arg_t) * th_nr);

    // create threads & pass arguments
    for(int i = 0; i < th_nr; ++i) {
        args[i].id = i;
        args[i].n = &n; 
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

    // free memory
    free(args);
    free(th);
    
    printf("n = %d\n", n);

    return 0;
}