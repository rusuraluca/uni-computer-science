bits 32
global start        

extern exit
import exit msvcrt.dll


segment data use32 class=data

global functie
hex dd 16
suma db 0
segment code use32 class=code
    functie:
        ;[ESP+0]->Adresa de revenire
        ;[ESP+4]->Adresa sirului de dublucuvinte
        ;[ESP+8]->Adresa sirului de sume (care trebuie format)
        ;[ESP+12]->Lungimea sirului
        mov ecx,[ESP+12];In ecx vom avea lungimea sirului
        mov esi,[ESP+4]
        mov edi,[ESP+8]
        cld;DF=0 (mergem de la stanga la dreapta)
        
        repeta:
            lodsd;eax=Primul element din sir, si ESI creste cu 4
                mov byte[suma],0
                    repeta2:
                    cmp eax,0
                    je final_repeta2
                    
                    mov edx,0;Ca sa putem face impartirea la 16
                    div dword[hex]
                    ;In dl vom avea ultima cifra (este un nr intre 0 si 15, deci incape pe un byte)
                    add byte[suma],dl;In eax vom avea catul, deci nu mai facem nimic
                    jmp repeta2
                final_repeta2:
            mov al,[suma]
            stosb;Incarcam suma si crestem EDI
        
        loop repeta
        
        ret
        push    dword 0
        call    [exit]
