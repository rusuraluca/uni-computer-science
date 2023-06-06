/*
Create a C program that converts all lowercase letters from the command line arguments to uppercase letters and prints the result. 
Use a thread for each given argument.
*/

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <ctype.h>

void *f(void *arg){
    char *str = (char *) arg;
    for(int i = 0; str[i] != '\0'; ++i) {
        str[i] = toupper(str[i]);
    }
    return NULL;
}

int main(int argc, char *argv[]){
    if (argc < 2){
        printf("Provide one argument!\n");
        exit(1);
    }

    int th_nr = argc - 1;
    pthread_t *th = malloc(sizeof(pthread_t) * th_nr);

    for(int i = 0; i < th_nr; ++i) {
        if(0 != pthread_create(&th[i], NULL, f, argv[i + 1])){ 
            perror("Cannot create thread");
            exit(1);
        }
    }

     for(int i = 0; i < th_nr; ++i) {
        pthread_join(th[i], NULL); 
    }

    free(th);

    for(int i = 1; i < argc; ++i) {
        printf("%s ", argv[i]);
    }
    printf("\n");
    return 0;
}