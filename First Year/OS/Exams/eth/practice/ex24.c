/*
24. Write a C program that creates N threads and one child process (N given as a command line argument). 
Each thread will receive a unique id from the parent. 
Each thread will generate two random numbers between 1 and 100 and will print them together with its own id. 
The threads will send their generated numbers to the child process via pipe or FIFO. 
The child process will calculate the average of each pair of numbers received from a thread 
and will print it alongside the thread id. Use efficient synchronization.
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <ctype.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <fcntl.h>

#define MAX_SIZE 100

// stubborn read/write are not mandatory to be used
// but this is an example showing how to implement/use them with PIPE
// similarly, they can be used for FIFO

int stubborn_read(int fd, void* buf, int count, int trials) {
  int k=0, total = 0, n = 0;
  while(total < count && n < trials && (k=read(fd, buf+total, count-total)) > 0) {
    total += k;
    n++;
  }
  return k < 0 ? k : total;
}

int stubborn_write(int fd, void* buf, int count, int trials) {
  int k=0, total = 0, n = 0;
  while(total < count && n < trials && (k=write(fd, buf+total, count-total)) > 0) {
    total += k;
    n++;
  }
  return k < 0 ? k : total;
}

int main(int argc, char *argv[]) {
  if(argc < 2) {
    printf("Too few arguments\n");
    exit(1);
  }
  int p[2];
  pipe(p);
  int f = fork();
  if(-1 == f) {
    perror("Error on fork");
    close(p[0]);
    close(p[1]);
    exit(1);
  } else if (0 == f) {
    close(p[0]);
    int fd = open(argv[1], O_RDONLY);
    if(fd < 0) {
      perror("Error opening file");
      close(p[1]);
      exit(1);
    }
    int k, i;
    char *buf = malloc(MAX_SIZE);
    int transform = 0;
    while((k = read(fd, buf, MAX_SIZE)) > 0) {
      for(i = 0; i < k; i++) {
        if(buf[i] == '.') {
          transform = 1;
        } else if(transform) {
          /*
           * This part converts uppercase letters to lowercase letters, not needed for the actual solution
             if(isupper(buf[i])) {
             buf[i] += 'a' - 'A';
             transform = 0;
             } else 
          */
          if (islower(buf[i])) {
            buf[i] += 'A' - 'a';
            transform = 0;
          } else if (!islower(buf[i]) && !isspace(buf[i])) {
            transform = 0;
          }
        }
      }
      if (0 > stubborn_write(p[1], &k, sizeof(int), 3)) {
        perror("Error writing length to parent");
        free(buf);
        close(p[1]);
        close(fd);
        exit(1);
      }
      if (0 > stubborn_write(p[1], buf, k, 3)) {
        perror("Error writing to parent");
        free(buf);
        close(p[1]);
        close(fd);
        exit(1);
      }
      memset(buf, 0, MAX_SIZE);
    }
    int status = 0;
    if(k < 0) {
      perror("Error reading data from file");
      status = 1;
    }
    if (0 > stubborn_write(p[1], &k, sizeof(int), 3)) {
      perror("Error writing final message to parent");
      close(p[1]);
      status = 1;
    }
    free(buf);
    close(fd);
    close(p[1]);
    exit(status);
  }
  close(p[1]);
  int k, len = 1;
  char *buf = malloc(MAX_SIZE);
  while(len > 0) {
    //this sets all the bytes in the buf to 0, essentially a cleanup
    memset(buf, 0, MAX_SIZE);
    if(0 > (k = stubborn_read(p[0], &len, sizeof(int), 3))) {
      perror("Error reading size from child");
      len = 0;
    }
    if(0 > (k = stubborn_read(p[0], buf, len, 3))) {
      perror("Error reading string from child");
      len = 0;
    }
    //since we don't know (or care) that the string received from the child process is NULL terminated
    //we can use write to print to stdout a fixed number of bytes, which we do know
    //reminder:
    // 0 - file descriptor for stdin (process reads the input from here)
    // 1 - file descriptor for stdout (process writes the output here)
    // 2 - file descriptor for stderr (process will print error messages here if using perror for examples)
    if(0 > write(1, buf, sizeof(char) * k)) {
      perror("Error displaying line on screen");
    }
  }
  free(buf);
  if(len < 0) {
    printf("Child terminated with a I/O error\n");
  }
  close(p[0]);
  wait(0);
  return 0;
}