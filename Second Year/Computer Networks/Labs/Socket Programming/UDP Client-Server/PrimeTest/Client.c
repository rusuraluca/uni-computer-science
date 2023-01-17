/*
Un client trimite unui server un numar.
Serverul va returna clientului un boolean care sa indice daca numarul respective este prim sau nu.
*/
#include <sys/types.h>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <string.h>

int main() {
        int c;
        struct sockaddr_in server;
        uint16_t nr,ok;

        c = socket(AF_INET, SOCK_DGRAM, 0);
        if (c < 0) {
                printf("Eroare la crearea socketului client\n");
                return 1;
        }

        memset(&server, 0, sizeof(server));
        server.sin_port = htons(1234);
        server.sin_family = AF_INET;
        server.sin_addr.s_addr = INADDR_ANY;

        printf("nr=");scanf("%hu",&nr);
        nr=htons(nr);
        sendto(c, &nr, sizeof(nr), 0, (struct sockaddr *) &server, sizeof(server));
        int l=sizeof(server);
        recvfrom(c, &ok, sizeof(ok), MSG_WAITALL, (struct sockaddr *) &server, &l);
        ok=ntohs(ok);
        if(ok==1) printf("Numarul este prim\n");
        else printf("Numarul nu e prim\n");
        close(c);
}