#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <signal.h>
#include <unistd.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>

int c;

void solve() {
    if (c < 0) {
        fprintf(stderr, "Eroare la stabilirea conexiunii cu clientul.\n");
        exit(1);
    }
    else
        printf("Un nou client s-a conectat cu succes.\n");

    FILE *pf;
    char command[100];
    char data[512];
    struct sockaddr_in server;

    int cod = recv(c, command, 100, 0);

    pf = popen(command, "r"); // setup our pipe for reading and execute our command

    fgets(data, 512 , pf); // get the data from the process execution

    if (pclose(pf) != 0)
        fprintf(stderr,"Error: Failed to close command stream\n");

    send(c, data, strlen(data)+1, 0);

    printf("Clientul a rulat %s\n", data);

    close(c);

    exit(0);
}


int main() {
    int s, l, cod;
    struct sockaddr_in client, server;

    s = socket(PF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        fprintf(stderr, "Eroare la creare socket server.\n");
        return 1;
    }

    memset(&server, 0, sizeof(struct sockaddr_in));
    server.sin_family = AF_INET;
    server.sin_port = htons(4321);
    server.sin_addr.s_addr = INADDR_ANY;

    cod = bind(s, (struct sockaddr *) &server, sizeof(struct sockaddr_in));
    if (cod < 0) {
        fprintf(stderr, "Eroare la bind. Portul este deja folosit.\n");
        return 1;
    }

    listen(s, 5);

    while (1) { // deserveste oricati clienti

        memset(&client, 0, sizeof(client));
        l = sizeof(client);

        printf("Astept sa se conecteze un client.\n");
        c = accept(s, (struct sockaddr *) &client, &l);
        printf("S-a conectat clientul cu adresa %s si portul %d.\n", inet_ntoa(client.sin_addr), ntohs(client.sin_port));

        if (fork() == 0) {
            solve();
        }
    }

}