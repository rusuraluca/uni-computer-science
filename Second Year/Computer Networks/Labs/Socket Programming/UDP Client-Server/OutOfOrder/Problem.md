Un client UDP trimite unui server toate numerele de la 1 la 10000. 
Serverul primeste numerele si afiseaza un mesaj de fiecare data cand primeste un numar “out of order”. 

Acest lucru se intampla deoarece protocolul UDP nu este orientat pe conexiune 
si nu face validari si verificari in ceea ce priveste trimiterea/receptionarea 
pachetelor care pot sa soseasca la receptor in alta ordine fata de ordinea in care au fost trimise, 
sau frecvent, chiar sa se piarda.
