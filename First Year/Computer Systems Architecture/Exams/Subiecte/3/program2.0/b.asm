bits 32
global start        

extern exit
import exit msvcrt.dll

segment data use32 class=data

global functie
maxim db 0
suma db 0
segment code use32 class=code
    functie:
        ;[ESP+0] - Adresa de revenire
        ;[ESP+4] - Adresa sirului de dublucuvinte
        ;[ESP+8] - Adresa sirului de octeti pe care trebuie sa il formam
        ;[ESP+12] - Adresa sumei (in care trebuie sa punem suma obtinuta)
        ;[ESP+16] - Lungimea sirului
        mov esi,[ESP+4];Iteram prin sirul dat cu ESI
        mov edi,[ESP+8];Iteram prin sirul destinatie cu EDI
        mov ecx,[ESP+16]
        repeta:
            ;In fiecare dword avem 7 posibil octeti (4 principali si restul formati)
            mov ebx,0;De la 0 pana la 7
            mov byte[maxim],0
            repeta2:
                ;In [ESI+EBX] se afla adresa octetului pe care vrem sa il verificam
                mov al,[ESI+EBX]
                cmp al,[maxim]
                jb sari
                    ;Avem un nou maxim
                    mov [maxim],al
                sari:
            inc ebx
            cmp ebx,4
            jne repeta2
            ;Adaugam la suma maximul gasit
            mov al,[maxim]
            add [suma],al
            ;Adaugam in memorie maximul gasit si incrementam edi
            stosb
            ;Incrementam esi
            add esi,4
        loop repeta
        
        mov al,[suma]
        mov esi,[ESP+12]
        mov [esi],al
        ret
        push    dword 0
        call    [exit]
