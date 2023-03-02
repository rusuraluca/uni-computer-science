bits 32
global start        

extern exit,printf
import exit msvcrt.dll
import printf msvcrt.dll

segment data use32 class=data
extern functie
;Se da un sir de dublucuvinte de la tastatura. Se cere sa se afiseaze cel mai mare OCTET din fiecare numar, si suma tuturor octetiilor obtinutil
sir dd 1234A678h,12345678h,1AC3B47Dh,0FEDC9876h
len_sir EQU ($-sir)/4
sir_mare times len_sir db 0
suma db 0
format_afisare db '%x ',0
aux dd 0
new_line db 10,13,0
format_afisare_signed db '%d',0
segment code use32 class=code
    start:
        ;functie(sir,sir_mare,suma,len_sir)
        push dword len_sir
        push dword suma
        push dword sir_mare
        push dword sir
        call functie
        add esp,4*4
        ;Afisam pe ecran sirul
        mov ecx,len_sir
        mov esi,sir_mare
        repeta:
            mov [aux],ecx
            movzx eax,byte[ESI]
            ;printf(format_afisare,eax)
            push dword eax
            push dword format_afisare
            call [printf]
            add esp,4*2
            inc esi
            mov ecx,[aux]
        loop repeta
        ;printf(new_line)
        push dword new_line
        call [printf]
        add esp,4
        ;Afisam suma
        movsx eax,byte[suma]
        ;printf(format_afisare_signed,eax)
        push dword eax
        push dword format_afisare_signed
        call [printf]
        add esp,4*2
        push    dword 0
        call    [exit]
