;sir de dwords, gasesc byte-ul maxim unsigned, il afisez pe ecran alaturi de suma signed a toti bytii gasiti(la final)
bits 32 ; assembling for the 32 bits architecture

; declare the EntryPoint (a label defining the very first instruction of the program)
global start        

; declare external functions needed by our program
extern exit,printf               ; tell nasm that exit exists even if we won't be defining it
import exit msvcrt.dll    ; exit is a function that ends the calling process. It is defined in msvcrt.dll
import printf msvcrt.dll                          ; msvcrt.dll contains exit, printf and all the other important C-runtime specific functions

; our data is declared here (the variables needed by our program)
segment data use32 class=data
    s dd 1234A678h, 12345678h, 1AC3B47Dh, 0FEDC9876h
    lens equ $-s
    max db 0
    format_h db '%x ',0
    format_d db '%d',0
    suma db 0
    copie dd -1

; our code starts here
segment code use32 class=code
    start:
        mov ecx,lens/4
        mov esi,s
        repeta:
        
            mov [copie],ecx
            
            mov ecx,4
            mov byte[max],0
            repeta_max:
            
                lodsb ;in al byte ul de verificat
                cmp al,byte[max]
                jbe nu_schimba
                
                ;aici intra daca trebuie sa actualizeze max
                mov byte[max],al
                
                nu_schimba:
            
            loop repeta_max
            
            ;afisez byte-ul maxim si il adun la suma
            mov eax,0
            mov al,byte[max]
            push eax
            push dword format_h
            call [printf]
            add esp,4*2
            
            mov al,byte[max]
            add byte[suma],al
            
            mov ecx,[copie]
        
        loop repeta
        
        ;afisez suma calculata
        movsx eax,byte[suma]
        
        push eax
        push dword format_d
        call [printf]
        add esp,4*2
        
        
    
        ; exit(0)
        push    dword 0      ; push the parameter for exit onto the stack
        call    [exit]       ; call exit to terminate the program
