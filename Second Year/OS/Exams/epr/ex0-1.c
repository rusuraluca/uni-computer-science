#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <string.h>

int main(int argc, char *argv[]) {
    if(argc < 2) {
        printf("Provide at least one argument\n");
        exit(1);
    }
    int c2p[2];
    if(0 > pipe(c2p)) {
        perror("Error on pipe");
        exit(1);
    }
    
    int f = fork();

    if(0 > f) {
        perror("Error on fork");
        exit(1);
    } else if (0 == f) {
        close(c2p[0]);
        FILE *fd = fopen(argv[1], "r");
        if(NULL == fd) {
            perror("Error opening file");
            exit(1);
        }
        int n;
        if(fscanf(fd, "%d", &n) < 1) {
            perror("Error reading matrix size");
            fclose(fd);
            exit(1);
        }
        int **a, **b, **result;
        a = malloc(sizeof(int*) * n);
        b = malloc(sizeof(int*) * n);
        result = malloc(sizeof(int*) * n);

        for(int i = 0; i < n; i++) {
            a[i] = malloc(sizeof(int) * n);
            b[i] = malloc(sizeof(int) * n);
            result[i] = malloc(sizeof(int) * n);
            memset(result[i], 0, sizeof(int) * n);
        }

        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                fscanf(fd, "%d", &a[i][j]);
            }
        }

        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                fscanf(fd, "%d", &b[i][j]);
            }
        }

        fclose(fd);

        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                for(int k = 0; k < n; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }

        // don't need these matrixes anymore
        for(int i = 0; i < n; i++) {
            free(b[i]);
            free(a[i]);
        }
        free(a);
        free(b);

        if(0 > write(c2p[1], &n, sizeof(int))) {
            perror("Error when writing the matrix size from the child process");
            for(int i = 0; i < n; i++) {
                free(result[i]);
            }
            free(result);
            close(c2p[1]);
            exit(1);
        }
        // we can send the matrix row by row because malloc allocates a chunk of continuous memory
        // alternatively, we can send element by element (this makes more write operations, but still gets the job done)
        for(int i = 0; i < n; i++) {
            if(0 > write(c2p[1], result[i], n *  sizeof(int))) {
                perror("Error when writing result row to the parent");
                close(c2p[1]);
                for(int i = 0; i < n; i++) {
                    free(result[i]);
                }
                free(result);
                exit(1);
            }
        }
        for(int i = 0; i < n; i++) {
            free(result[i]);
        }
        free(result);
        close(c2p[1]);
        exit(0);
    } else {
        close(c2p[1]);
        int n;
        if(0 > read(c2p[0], &n, sizeof(int))) {
            perror("Error reading matrix size in the parent process");
            wait(0);
            exit(1);
        }
        int **result;
        result = malloc(sizeof(int*) * n);
        for(int i = 0; i < n; i++) {
            result[i] = malloc(sizeof(int) * n);
            if(0 > read(c2p[0], result[i], sizeof(int) * n)) {
                perror("Error reading row from child");
                for(int j = 0; j <= i; i++) {
                    free(result[j]);
                }
                free(result);
                wait(0);
                exit(1);
            }
        }
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                // format to print integers as if they would have 5 digits; makes spacing slightly prettier
                printf("%5d", result[i][j]);
            }
            printf("\n");
        }

        for(int i = 0; i < n; i++) {
            free(result[i]);
        }
        free(result);
        wait(0);
    }

    return 0;
}
