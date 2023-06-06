/*
23. Write a C program that receives any number of strings as command line arguments. 
The program creates two child processes, which inherit the parent's command line arguments 
(i.e. no need to send the arguments via pipe/fifo to the children for this problem). 
Each child process creates a thread for each of the command line arguments. 
Each thread created by the first child will extract the vowels from its argument 
and will append them to a string shared among the threads. 
Each thread created by the second child process will extract the digits from its argument and will add them to a sum shared among the threads. 
Both child processes wait for their respective threads to finish and send the result to the parent via pipe. The parent displays the results.
*/

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <pthread.h>

typedef struct {
    char *str;
    char *rez;
    int *count;
    pthread_mutex_t *m;
} data_1;

typedef struct {
    char *str;
    int *sum;
    pthread_mutex_t *m;
} data_2;

int write_to_channel(int fd, char *buf) {
    int nr = strlen(buf);
    if(0 > write(fd, &nr, sizeof(int))) {
        perror("Error on write size to channel: ");
        return -1;
    }
    if(0 > write(fd, buf, nr * sizeof(char))) {
        perror("Error on write message to channel: ");
        return -1;
    }
    return 0;
}

void read_from_channel(int fd, int max, char *buf) {
    int read_bytes = 0;
    while(read_bytes < max) {
        int k;
        if((k = read(fd, buf + read_bytes, (max - read_bytes) * sizeof(char))) > 0) {
            read_bytes += k;
        }
    }
}

void *thrd_func_1(void *a) {
    data_1 arg = *((data_1*) a);
    int i;  
    for (i = 0; i < strlen(arg.str); i++) {
        if (arg.str[i] == 'a' || arg.str[i] == 'e' || arg.str[i] == 'i' || arg.str[i] == 'o' || arg.str[i] == 'u' 
                || arg.str[i] == 'A' || arg.str[i] == 'E' || arg.str[i] == 'I' || arg.str[i] == 'O' || arg.str[i] == 'U') {
            pthread_mutex_lock(arg.m);
            arg.rez[*(arg.count)] = arg.str[i];
            *(arg.count) += 1;
            pthread_mutex_unlock(arg.m);
        }
    }
    return NULL;
}

void *thrd_func_2(void *a) {
    data_2 arg = *((data_2*) a);
    int i;
    for (i = 0; i < strlen(arg.str); i++) {
        if (arg.str[i] >= '0' && arg.str[i] <= '9') {
            pthread_mutex_lock(arg.m);
            *(arg.sum) += (arg.str[i] - '0');
            pthread_mutex_unlock(arg.m);
        }
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Please provide at least one string argument!\n");
        exit(1);
    }
    int p1[2], p2[2];
    if (0 > pipe(p1)) {
        perror("Error creating first pipe: ");
        exit(1);
    }

    if (0 > pipe(p2)) {
        perror("Error creating second pipe: ");
        exit(1);
    }
    int n = argc-1, i;
    int f1 = fork();
    if (0 > f1) {
        perror("Error creating first child process: ");
        exit(1);
    } else if (0 == f1) {
        close(p2[0]);
        close(p2[1]);
        close(p1[0]);
        int len = 0;
        for (i = 0; i < n; i++) {
            len += strlen(argv[i+1]);
        }
        // in case all the given arrguments contain only vowels, we need one more char to put a NULL terminator in the string
        len++;
        pthread_mutex_t *m = malloc(sizeof(pthread_mutex_t));
        pthread_mutex_init(m, NULL);
        char *rez = malloc(sizeof(char) * len);
        memset(rez, 0, sizeof(char) * len);
        int *count = malloc(sizeof(int));
        *count = 0;
        data_1 *args = malloc(sizeof(data_1) * n);
        pthread_t *T = malloc(sizeof(pthread_t) * n);
        for (i = 0; i < n; i++) {
            args[i].str = argv[i+1];
            args[i].count = count;
            args[i].rez = rez;
            args[i].m = m;
            if (0 != pthread_create(&T[i], NULL, thrd_func_1, (void*) &args[i])) {
                perror("Error creating threads in the first child process: ");
                exit(1);
            }
        }
        for (i = 0; i < n; i++) {
            pthread_join(T[i], NULL);
        }
        if (-1 == write_to_channel(p1[1], rez)) {
            free(T);
            free(args);
            free(count);
            free(rez);
            free(m);
            close(p1[1]);
            exit(1);
        }
        free(T);
        free(args);
        free(count);
        free(rez);
        free(m);
        close(p1[1]);
        exit(0);
    }

    int f2 = fork();
    if (0 > f2) {
        perror("Error creating second child process: ");
        exit(1);
    } else if (0 == f2) {
        close(p1[0]);
        close(p1[1]);
        close(p2[0]);
        pthread_mutex_t *m = malloc(sizeof(pthread_mutex_t));
        pthread_mutex_init(m, NULL);
        int *sum = malloc(sizeof(int));
        *sum = 0;
        data_2 *args = malloc(sizeof(data_2) * n);
        pthread_t *T = malloc(sizeof(pthread_t) * n);
        for (i = 0; i < n; i++) {
            args[i].str = argv[i+1];
            args[i].sum = sum;
            args[i].m = m;
            if (0 != pthread_create(&T[i], NULL, thrd_func_2, (void*) &args[i])) {
                perror("Error creating threads in the second child process: ");
                free(T);
                free(args);
                free(sum);
                free(m);
                close(p2[1]);
                exit(1);
            }
        }
        for (i = 0; i < n; i++) {
            pthread_join(T[i], NULL);
        }
        if (0 > write(p2[1], sum, sizeof(int))) {
            perror("Error writing sum to parent: ");
            free(T);
            free(args);
            free(sum);
            free(m);
            close(p2[1]);
            exit(1);
        }
        free(T);
        free(args);
        free(sum);
        free(m);
        close(p2[1]);
        exit(0);
    }
    close(p1[1]);
    close(p2[1]);
    char *buf;
    int max;
    if (0 > read(p1[0], &max, sizeof(int))) {
        perror("Error reading string size from the first child: ");
    }

    buf = malloc(sizeof(char) * (max + 1));
    memset(buf, 0, sizeof(char) * (max + 1));
    read_from_channel(p1[0], max, buf);

    int sum;
    if (0 > read(p2[0], &sum, sizeof(int))) {
        perror("Error reading sum from the second child: ");
    }
    close(p1[0]);
    close(p2[0]);
    wait(0);
    wait(0);

    printf("All vowels: %s\n", buf);
    printf("Sum of digits: %d\n", sum);
    free(buf);
    return 0;
}