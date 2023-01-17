#include <sys/types.h>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <string.h>

uint16_t prim(uint16_t nr){
        int ok=1,d;
        for(d=2;d<=nr/2&&ok==1;d++)
                if(nr%d==0)ok=0;
        return ok;
}


int main() {
        int s,l;
        struct sockaddr_in server, client;
        uint16_t nr,ok=0;

        s = socket(AF_INET, SOCK_DGRAM, 0);
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

        l = sizeof(client);
        memset(&client, 0, sizeof(client));

        recvfrom(s, &nr, sizeof(nr), MSG_WAITALL, (struct sockaddr *) &client, &l);
        nr = ntohs(nr);
        ok=prim(nr);
        ok=htons(ok);
        sendto(s, &ok, sizeof(ok), 0, (struct sockaddr *) &client, l);
        close(s);
}