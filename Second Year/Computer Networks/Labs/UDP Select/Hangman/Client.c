#include <arpa/inet.h>
#include <ctype.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

int validate_number(char *str) {
  while (*str) {
    if (!isdigit(*str)) { // if the character is not a number, return
      return 0;
    }

    str++; // point to next character
  }
  return 1;
}

int validate_ip(char *ip) { // check whether the IP is valid or not

  if (ip == NULL)
    return 0;

  int num, dots = 0;

  char *ptr;

  char *aux = malloc(strlen(ip) * sizeof(char) + 1);

  memcpy(aux, ip, strlen(ip) + 1);

  ptr = strtok(aux, "."); // cut the string using dor delimiter

  if (ptr == NULL) {
    free(aux);
    return 0;
  }

  while (ptr) {
    if (!validate_number(
            ptr)) // check whether the sub string is holding only number or not
    {
      free(aux);
      return 0;
    }

    num = atoi(ptr); // convert substring to number

    if (num >= 0 && num <= 255) {
      ptr = strtok(NULL, "."); // cut the next part of the string

      if (ptr != NULL)
        dots++; // increase the dot count
    } else {
      free(aux);
      return 0;
    }
  }
  if (dots != 3) // if the number of dots are not 3, return false
  {
    free(aux);
    return 0;
  }

  free(aux);
  return 1;
}

int main(int argc, char **argv) {

  // Validating cli arguments

  if (argc < 3) {
    printf("Give server and port.\n");
    return 1;
  }

  if (!validate_ip(argv[1])) {
    printf("Server must be a valid ip address server.\n");
    return 2;
  }

  if (!validate_number(argv[2])) {
    printf("Port must be integer.\n");
    return 3;
  }

  // Initialising socket

  struct sockaddr_in server;

  int socket_fd;

  printf("Creating socket.\n");

  if ((socket_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
    perror("Socket creation failed.\n");
    exit(EXIT_FAILURE);
  }

  server.sin_port = atoi(argv[2]);
  server.sin_family = AF_INET;
  server.sin_addr.s_addr = inet_addr(argv[1]);

  printf("Connecting to server %s:%s.\n", argv[1], argv[2]);

  if (connect(socket_fd, (struct sockaddr *)&server, sizeof(server)) < 0) {
    perror("Connection error.\n");
    exit(EXIT_FAILURE);
  }

  size_t word_len;
  char word[100];

  recv(socket_fd, &word_len, sizeof(size_t), 0);

  size_t buf_size = sizeof(char) * (word_len + 1);
  recv(socket_fd, word, buf_size, 0);
  printf("Word is: %s", word);

  do {
    printf("Guess next char: ");
    char c;
    scanf("%c", &c);

    send(socket_fd, &c, sizeof(char), 0);
    recv(socket_fd, word, buf_size, 0);

    printf("Word is: %s", word);
  } while (strchr(word, '_'));

  close(socket_fd);
  return 0;
}