#include <pthread.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int n, max;
int *numbers;
pthread_t *tids;
pthread_barrier_t barrier;

// thread function
void *add(void *arg) {
    int idx = *(int*)arg;
    // we wait for all threads to start, so the following joins will not fail due to thread not being initialized
    pthread_barrier_wait(&barrier);
    int l, r;
    int i, j;
    // if we are in one of the threads from the first half 
    // we have to wait for 2 other threads to finish calculating
    // eg. 1 waits for 2 and 3
    // 2 waits for 4 and 5
    // 3 waits for 6 and 7
    // 
    // if we are inside a thread from the second half, we don't have to wait for anyone, we just calculate
    if(idx < max / 2) {
        // apply formula to determine the indexes of the two threads we have to wait for
        l = 2 * idx;
        r = l + 1;
        // once initialized, we can wait for the threads to terminate
        pthread_join(tids[l], NULL);
        pthread_join(tids[r], NULL);
    }
    // regardless if we had to wait at the previous step, we must calculate which 2 numbers from the thread we will add
    // eg. 
    // thread max/2 will do a[0] += a[1]
    // thread max/2 + 1 will do a[2] += a[3]
    // so the partial sums are stored on certain positions of the array
    // maybe try on paper to verify the formula here, although it should hold for any power of 2 (since max is a power of 2 always)
    //
    // a more concrete example:
    // let say we have array with elements
    // a0 a1 a2 a3
    // thread 2 will do a0 = a0 + a1
    // thread 3 will do a2 = a2 + a3
    // thread 1 waits for thread 2 and 3
    // thread 1 will do a0 = a0 + a2, which, after threads 2 and 3 have terminated is equal to a0 + a1 + a2 + a3
    j = max;
    while (j > idx && j > 1) { j /= 2; }
    i = j;
    l = 0;
    r = 0;
    while (i < idx) {
        i++;
        l += max / j;
    }
    r = l + max / j / 2;
    // once the correct indices have been calculated simply add the two numbers
    numbers[l] += numbers[r];
    return NULL;
}

int main(int argc, char **argv) {
    if(argc < 2) {
        printf("Please provide a number\n");
        exit(1);
    }
    // convert the argument from char* to int
    // atoi will convert all the consecutive digits from the beginning of a string to a number
    // but atoi does not detect errors, so we can't really check for that
    n = atoi(argv[1]);
    if (n < 1) {
        // but we can check if the given number is not a reasonable number of elements in an array
        printf("Please provide a strictly positive argument.\n");
        exit(1);
    }
    max = 1;
    // calculate the power of two that is immediately greater than n
    // this way we can ensure that we always have a full binary tree
    while(max < n) {
        max *= 2;
    }
    int i;
    numbers = malloc(max * sizeof(int));
    for(i = 0; i < max; i++) {
        if(i < n) {
            // read n numbers from standard input
            printf("a[%d]=", i);
            scanf("%d", &numbers[i]);
        } else {
            // between n and max, set the elements to 0, so they do not alter the sum
            numbers[i] = 0;
        }
    }
    if (max == 1) {
        // one element, nothing to calculate so we skip
        printf("%d\n", numbers[0]);
        free(numbers);
        return 0;
    }
    pthread_barrier_init(&barrier, NULL, max - 1);
    tids = malloc(sizeof(pthread_t) * max);
    int *ids = malloc(max * sizeof(int));
    for(i = 0; i < max; i++) {
        // thread ids which will be passed as parameters when creating the threads
        ids[i] = i;
    }

    for(i = 1; i < max; i++) {
        // we will always need max - 1 threads to calculate the sum, and for the sake of the formula used
        // to determine which thread has to wait for which other threads, starting with id = 1 is best
        if(0 > pthread_create(&tids[i], NULL, add, (void*)(&ids[i]))) {
            perror("Error starting thread ");
            exit(1);
        }
    }

    // because of the thread hierarchy where certain threads wait for other threads, only thread Nr. 1 is not joined by anyone, so we wait here
    if(0 > pthread_join(tids[1], NULL)) {
        perror("Error encountered while waiting for thread to terminate ");
    }
    // the sum will be calculated on the postion of the first element of the array
    printf("%d\n", numbers[0]);

    // cleanup
    pthread_barrier_destroy(&barrier);
    free(numbers);
    free(tids);
    free(ids);
    return 0;
}