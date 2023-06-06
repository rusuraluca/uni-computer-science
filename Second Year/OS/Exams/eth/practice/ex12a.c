/*
12a. Write a C program that reads a matrix of integers from a file. It then creates as many threads as there are rows in the matrix, 
each thread calculates the sum of the numbers on a row. 
The main process waits for the threads to finish, then prints the sums.
*/

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct {
    int row;
    int *sum;
    int **matrix;
    pthread_mutex_t *mutex;
} thread_arg_t;

void *func(void *arg) {
    thread_arg_t dt = *((thread_arg_t *) arg);
    int i;
    for (i = 0; i < dt.row; i++) {
        pthread_mutex_lock(dt.mutex);
        *(dt.sum) += dt.matrix[dt.row][i];
        pthread_mutex_unlock(dt.mutex);
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Invalid number of arguments!\n");
        exit(1);
    }

    FILE *f = fopen(argv[1], "r");
    if (f == NULL) {
        perror("Cannot open file");
        exit(1);
    }

    int n;
    fscanf(f, "%d", &n);
    int **matrix = malloc(n * sizeof(int *));
    int i, j;
    for (i = 0; i < n; i++) {
        matrix[i] = malloc(n * sizeof(int));
        for (j = 0; j < n; j++) {
            fscanf(f, "%d", &matrix[i][j]);
        }
    }
    fclose(f);

    int *sum = malloc(sizeof(int));
    *sum = 0;
    pthread_mutex_t *mutex = malloc(sizeof(pthread_mutex_t));
    pthread_mutex_init(mutex, NULL);

    pthread_t *th = malloc(n * sizeof(pthread_t));
    thread_arg_t *args = malloc(n * sizeof(thread_arg_t));
    for (i = 0; i < n; i++) {
        args[i].row = i;
        args[i].sum = sum;
        args[i].matrix = matrix;
        args[i].mutex = mutex;
        pthread_create(&th[i], NULL, func, &args[i]);
    }

    for (i = 0; i < n; i++) {
        pthread_join(th[i], NULL);
    }

    printf("Sum: %d\n", *sum);

    for (i = 0; i < n; i++) {
        free(matrix[i]);
    }
    free(matrix);
    free(sum);
    free(mutex);
    free(th);
    free(args);

    return 0;
}