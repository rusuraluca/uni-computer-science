/*
Un client trimite unui server doua numere.
Serverul va returna clientului suma celor doua numere.
*/
#include <sys/types.h>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <string.h>

int main() {
        struct sockaddr_in server, client;
        uint16_t a,b,suma;

        int s = socket(AF_INET, SOCK_DGRAM, 0);
        if (s < 0) {
                printf("Eroare la crearea socketului server\n");
                return 1;
        }

        memset(&server, 0, sizeof(server));
        server.sin_port = htons(1234);
        server.sin_family = AF_INET;
        server.sin_addr.s_addr = INADDR_ANY;

        if (bind(s, (struct sockaddr *) &server, sizeof(server)) < 0) {
                printf("Eroare la bind\n");
                return 1;
        }

        int l = sizeof(client);
        memset(&client, 0, sizeof(client));
        int len=recvfrom(s, &a, sizeof(a), MSG_WAITALL, (struct sockaddr *) &client, &l);
        recvfrom(s, &b, sizeof(b), MSG_WAITALL, (struct sockaddr *) &client, &l);
        a = ntohs(a);
        b = ntohs(b);
        suma=a+b;
        suma=htons(suma);
        sendto(s, &suma, sizeof(suma), 0, (struct sockaddr *) &client, l);
        close(s);
}