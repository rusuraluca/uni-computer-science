#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <signal.h>
#include <unistd.h>
#include <stdlib.h>

int c;

// Mecanismul de time-out. Paragraful 3.
void time_out(int semnal) {
  int32_t r = -1;
  r = htonl(r);
  printf("Time out.\n");
  send(c, &r, sizeof(int32_t), 0);
  close(c); // desi nu am primit nimic de la client in 10 secunde, inchidem civilizat conexiunea cu acesta
  exit(1);
}

void tratare() {
  int cod;
  int32_t r;
  uint8_t b;
  // Observatie: Deoarece dimensiunea tipului int difera de la platforma la platforma,
  // (spre exemplu, in Borland C in DOS e reprezentat pe 2 octeti, iar in C sub Linux pe
  // 4 octeti) este necesara utilizarea unor tipuri intregi standard. A se vedea
  // stdint.h.
  struct sockaddr_in server;

  if (c < 0) {
    fprintf(stderr, "Eroare la stabilirea conexiunii cu clientul.\n");
    exit(1);
  }
  else
    printf("Un nou client s-a conectat cu succes.\n");

  signal(SIGALRM, time_out);
  alarm(10);

  r = 0; // rezultatul, numarul de caractere spatii primite de la client
  do {
    cod = recv(c, &b, 1, 0);
    printf("Am primit %d caractere.\n", cod);

    if (cod == 1) // citire cu succes a unui caracter
      alarm(10);  // resetam timerul si asteptam din nou 10 secunde urmatorul caracter

    if (cod != 1) {
      r = -1;
      break;
    }

    if (b == ' ') {
      // Paragraful 5 din protocolul
      if (r == INT32_MAX) { // intregul maxim pozitiv pe 4 octetii cu semn sau 0x7FFFFFFF (a se vedea stdint.h)
        r = -2;
        break;
      }
      r++;
    }
  }
  while (b != 0); // sirul de caractere de la client se considera terminat la intalnirea caracterului 0 (NULL, '\0')
  // Paragraful 2 - terminam citirea sirului de la client la primirea caracterului NULL

  alarm(0); // oprim timerul

  r = htonl(r);
  send(c, &r, sizeof(int32_t), 0);
  r = ntohl(r);

  close(c);

  if (r >= 0)
    printf("Am inchis cu succes conexiunea cu un client. I-am trimis %d spatii.\n", r);
  else {
    printf("Am inchis cu eroare conexiunea cu un client. Cod de eroare %d.\n", r);
    exit(1);
  }

  exit(0);
  // Terminam procesul fiu - foarte important!!! altfel numarul de procese creste exponential.
  // Fiul se termina dupa ce deserveste clientul.
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

    if (fork() == 0) { // server concurent, conexiunea va fi tratata de catre un proces fiu separat
      tratare();
    }
    // parintele continua bucla while asteptand un nou client
  }

}