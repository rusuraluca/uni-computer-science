#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <arpa/inet.h>
#include <unistd.h>

#define max 100

int main() {
    int c, cod;
    struct sockaddr_in server;
    char s[max];

    c = socket(PF_INET, SOCK_STREAM, 0);
    if (c < 0) {
        fprintf(stderr, "Eroare la creare socket client.\n");
        return 1;
    }

    memset(&server, 0, sizeof(struct sockaddr_in));
    server.sin_family = AF_INET;
    server.sin_port = htons(4321);
    server.sin_addr.s_addr = inet_addr("127.0.0.1");

    cod = connect(c, (struct sockaddr *) &server, sizeof(struct sockaddr_in));
    if (cod < 0) {
        fprintf(stderr, "Eroare la conectarea la server.\n");
        return 1;
    }

    printf("Dati o comanda de trimis la server: ");

    fgets(s, max, stdin);

    cod = send(c, s, strlen(s) + 1, 0);

    if (cod != strlen(s) + 1) {
        fprintf(stderr, "Eroare la trimiterea comenzii la server.\n");
        return 1;
    }

    cod = recv(c, s, 512, 0);
    if (cod < 0) {
        fprintf(stderr, "Eroare la primirea comenzii de la client.\n");
        return 1;
    }
    printf("Serverul a afisat %s\n", s);

    close(c);
}