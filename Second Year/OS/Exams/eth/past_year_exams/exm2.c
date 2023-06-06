#include <pthread.h>
#include <stdlib.h>
#include <stdio.h>

#define MAXVALUE 10000

typedef struct{
  int prev;
  int n;
  int next;
  int index;
}thread_args_t;

int turn = 0;
int value = 0;
pthread_mutex_t mutex;
pthread_cond_t cond;

void* thread(void* args){
  int prev = ((thread_args_t*)args)->prev;
  int n = ((thread_args_t*)args)->n;
  int next = ((thread_args_t*)args)->next;
  int index = ((thread_args_t*)args)->index;

  while(1){
    pthread_mutex_lock(&mutex);
    while(value < MAXVALUE && turn != index){
        fprintf(stderr, "Thread %d reached wait\n", index);
        pthread_cond_wait(&cond, &mutex);
    }
    if(value >= MAXVALUE){
        pthread_cond_broadcast(&cond);
        pthread_mutex_unlock(&mutex);
        break;
    }
    value += n;
    printf("thread %d increments with %d, value becomes %d\n", index, n, value);
    if(value % 2 == 0){
        turn = next;
    } else {
        turn = prev;
    }
    pthread_cond_broadcast(&cond);
    pthread_mutex_unlock(&mutex);
  }
  return NULL;
}



int main(int argc, char** argv){
  if(argc % 3 != 1){
    printf("Invalid number of arguments\n");
    return 1;
  }

  pthread_mutex_init(&mutex, NULL);
  pthread_cond_init(&cond, NULL);

  pthread_t* threads = (pthread_t*)malloc(sizeof(pthread_t) * (argc - 1) / 3);
  thread_args_t* args = (thread_args_t*)malloc(sizeof(thread_args_t) * (argc - 1) / 3);
  for(int i = 1; i < argc; i += 3) {
    args[i / 3].n = atoi(argv[i]);
    args[i / 3].next = atoi(argv[i + 1]);
    args[i / 3].prev = atoi(argv[i + 2]);
    args[i / 3].index = i / 3;
    pthread_create(&threads[i / 3], NULL, &thread, &args[i / 3]);
  }

  for(int i = 1;i < argc;i += 3){
    pthread_join(threads[i / 3], NULL);
  }

  free(args);
  free(threads);
  pthread_cond_destroy(&cond);
  pthread_mutex_destroy(&mutex);

  return 0;
}
