/*
27. Write a C program that takes two numbers, N and M, as arguments from the command line. 
The program creates N "generator" threads that generate random lowercase letters and append them to a string with 128 positions.
The program will create an additional "printer" thread that that waits until all the positions of the string are filled, 
at which point it prints the string and clears it. 
The N "generator" threads must generate a total of M such strings and the "printer" thread prints each one as soon as it gets to length 128.
*/

#include <stdlib.h>
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>
#include <string.h>
#include <time.h>
#define SIZE 128

typedef struct {
    pthread_mutex_t *m;
    pthread_cond_t *c1, *c2;
    int *string_counter, *curr_pos;
    char *buf;
} data;

void *producer(void *arg) {
    data d = *((data*) arg);
    while(1) {
        char x = random() % ('z' - 'a' + 1) + 'a';
        pthread_mutex_lock(d.m);
        if (*d.curr_pos == SIZE) {
            pthread_cond_signal(d.c1);
            while(*d.curr_pos == SIZE) pthread_cond_wait(d.c2, d.m);
        }
        if(*d.string_counter == 0) {
            break;
        }
        d.buf[*d.curr_pos] = x;
        (*d.curr_pos)++;
        pthread_mutex_unlock(d.m);
    }
    pthread_mutex_unlock(d.m);
    return NULL;
}

void *consumer(void *arg) {
    data d = *((data*) arg);
    while(1) {
        pthread_mutex_lock(d.m);
        if (*d.curr_pos != SIZE) {
            pthread_cond_signal(d.c2);
            while(*d.curr_pos != SIZE) pthread_cond_wait(d.c1, d.m);
        }
        printf("%s\n", d.buf);
        memset(d.buf, 0, sizeof(char) * SIZE);
        *d.curr_pos = 0;
        (*d.string_counter)--;
        pthread_cond_broadcast(d.c2);
        if(*d.string_counter == 0) {
            break;
        }
        pthread_mutex_unlock(d.m);
    }
    pthread_mutex_unlock(d.m);
    return NULL;
}

int main(int argc, char *argv[]) {
    if(argc < 3) {
        fprintf(stderr, "Please provide 2 numerical arguments!\n");
        exit(1);
    }
    srandom(time(NULL));
    int N = atoi(argv[1]);
    int M = atoi(argv[2]);
    int i, *count = malloc(sizeof(int));
    char *s = malloc(sizeof(char) * (SIZE + 1));
    *count = 0;
    memset(s, 0, sizeof(char) * (SIZE + 1));
    data *args = malloc((N + 1) * sizeof(data));
    pthread_t *th = malloc((N + 1) * sizeof(pthread_t));
    pthread_mutex_t *m = malloc(sizeof(pthread_mutex_t));
    pthread_cond_t *c1 = malloc(sizeof(pthread_cond_t));
    pthread_cond_t *c2 = malloc(sizeof(pthread_cond_t));
    pthread_mutex_init(m, NULL);
    pthread_cond_init(c1, NULL);
    pthread_cond_init(c2, NULL);
    for(i = 0; i < N; i++) {
        args[i].curr_pos = count;
        args[i].string_counter = &M;
        args[i].buf = s;
        args[i].m = m;
        args[i].c1 = c1;
        args[i].c2 = c2;
        pthread_create(&th[i], NULL, producer, &args[i]);
    }

    args[N].curr_pos = count;
    args[N].string_counter = &M;
    args[N].buf = s;
    args[N].m = m;
    args[N].c1 = c1;
    args[N].c2 = c2;
    pthread_create(&th[N], NULL, consumer, &args[N]);

    for(i = 0; i < N + 1; i++) {
        pthread_join(th[i], NULL);
    }

    pthread_cond_destroy(c1);
    pthread_cond_destroy(c2);
    pthread_mutex_destroy(m);
    free(args);
    free(count);
    free(s);
    free(c1);
    free(c2);
    free(m);
    free(th);
    return 0;
}