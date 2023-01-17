#include <arpa/inet.h>
#include <ctype.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/wait.h>
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

int main(int argc, char **argv) {
  // Validating cmd arguments

  if (argc < 2) {
    printf("Give me a port.\n");
    return 1;
  }

  if (!validate_number(argv[1])) {
    printf("Port must be integer.\n");
    return 2;
  }

  // Initializing socket

  int server_fd;

  struct sockaddr_in server_addr;

  int addrlen = sizeof(server_addr);

  printf("Creating socket.\n");

  if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
    perror("Socket creation failed\n");
    exit(EXIT_FAILURE);
  }

  server_addr.sin_family = AF_INET;
  server_addr.sin_addr.s_addr = INADDR_ANY;
  // Seting socket to listen on all available ip addresses
  // If you want the server to listen on a single ip address use the line below
  // insead inet_aton("1.2.3.4", &server_addr.sin_addr)

  // Setting bind port
  server_addr.sin_port = atoi(argv[1]);

  printf("Binding socket to port %s\n", argv[1]);

  // Binding server

  if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) <
      0) {
    perror("Bind error.\n");
    exit(EXIT_FAILURE);
  }

  printf("Listening.\n");

  // Listening for incoming connections

  if (listen(server_fd, 3) < 0) {
    perror("Listen error.\n");
    exit(EXIT_FAILURE);
  }

  while (1) {
    struct sockaddr_in client_addr;
    printf("Server waitng for clients.\n");

    int client = accept(server_fd, (struct sockaddr *)&client_addr, (socklen_t *)&addrlen);
    if (!fork()) {
      if (!client) {
        perror("Accept error.\n");
        exit(EXIT_FAILURE);
      }

      printf("New client connected: %s:%d.\n", inet_ntoa(client_addr.sin_addr), client_addr.sin_port);

      char c;
      char word[100];
      char guessed_word[100];

      printf("Enter word for client %s: ", inet_ntoa(client_addr.sin_addr));
      scanf("%s", word);

      size_t word_len = strlen(word);
      size_t buf_size = sizeof(char) * (word_len + 1);

      for (int i = 0; i < word_len; ++i)
        guessed_word[i] = '_';

      guessed_word[word_len] = 0;

      send(client, &word_len, sizeof(size_t), 0);
      send(client, guessed_word, buf_size, 0);

      while (strchr(guessed_word, '_')) {
        recv(client, &c, sizeof(char), MSG_WAITALL);
        c = tolower(c);

        for (int i = 0; i < word_len; ++i)
          if (guessed_word[i] == '_' && word[i] == c)
            guessed_word[i] = c;

        printf("Client %s guessed %c.\n", inet_ntoa(client_addr.sin_addr), c);
        printf("Current guessed word: %s\n", guessed_word);
        send(client, guessed_word, buf_size, 0);
      }

      printf("Client %s won.\n", inet_ntoa(client_addr.sin_addr));

      close(client);
    }
  }

  wait(0);
  return 0;
}