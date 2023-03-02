bits 32

global start        

extern exit,scanf
import exit msvcrt.dll
import scanf msvcrt.dll

segment data use32 class=data
; Citim un n de la tastatura, apoi n dublucuvinte, Se cere sa se stocheze in memorie toate n dublucuvintele, apoi sa se formeze un nou sir de octeti, in care
; stocam suma cifrelor pare din fiecare dublucuvant citit
sir_octeti times 3 db 0
sir_numere times 3 dd 0

sir times 5 dd 0
n dd 0
aux dd 0
format_citire db '%d',0
suma db 0
copie dd 0
segment code use32 class=code
    start:
        ;scanf(format_citire,n)
        push dword n
        push dword format_citire
        call [scanf]
        add esp,4*2
        
        mov ecx,[n]
        cmp ecx,0
        mov edi,sir_octeti
        mov esi,sir_numere
        je final
        repeta:
            mov [copie],ecx
             ;scanf(format_citire,aux)
             push dword aux
             push dword format_citire
             call [scanf]
             add esp,4*2
             mov ecx,[copie]
             ;Stocheaza numar
             mov eax,[aux]
             mov [esi],eax
             add esi,4
             ;Calculare suma
             mov byte[suma],0
             suma_repeta:
                cmp eax,0
                je final_suma
                mov edx,0
                mov ebx,10
                div ebx
                ;In edx avem ultima cifra
                ;If edx%2==0 => suma=suma+dl
                test dl,1
                jnz sari
                    add [suma],dl
                sari:
                
             jmp suma_repeta
             final_suma:
             mov al,[suma]
             mov [edi],al
             inc edi
        loop repeta
        final:
        push    dword 0
        call    [exit]
