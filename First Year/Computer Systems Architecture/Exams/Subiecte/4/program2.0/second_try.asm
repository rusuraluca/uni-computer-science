;se da sir de qwords, verific daca dword ul inferior are minim 2 secvente de 111 in binar
;daca are, salvez dword ul inferior si il afisez pe ecran in baza 2
bits 32 ; assembling for the 32 bits architecture

; declare the EntryPoint (a label defining the very first instruction of the program)
global start        

; declare external functions needed by our program
extern exit,printf               ; tell nasm that exit exists even if we won't be defining it
import exit msvcrt.dll    ; exit is a function that ends the calling process. It is defined in msvcrt.dll
import printf msvcrt.dll                          ; msvcrt.dll contains exit, printf and all the other important C-runtime specific functions

; our data is declared here (the variables needed by our program)
segment data use32 class=data
    dwords times 10 dd -1
    cnt db 0
    suma db 0
    s dq 00000000000000000000000001110111b, 00000000000000000000001011011101b
    lens equ $-s
    copie dd -1
    copie_ax dw -1
    copie_dx dw -1
    cnt_dwords db 0
    rez times 100 db -1
    format_d db '%d',0
    format_c db '%c',0
    spatiu dd ' '

    

; our code starts here
segment code use32 class=code
    start:
        mov esi,s
        mov edi,dwords
        mov ecx,lens/8
        
        repeta:
        
            lodsd ;in memorie sunt puse invers, deci aici a fost incarcat dword inferior in dx:ax
            mov [copie_ax],ax
            mov [copie_dx],dx
            
            ;verificam daca are 2 secvente 111
            mov [copie],ecx
            
            jmp verificare
            
            gata_verificare:
            
            ;daca avem 111>=2 atunci il adaugam intr-un sir de dwords
            cmp byte[cnt],2
            jl sari_3
            
            ;daca a ajuns aici trebuie salvat
            mov ax,[copie_ax]
            mov dx,[copie_dx]
            stosd
            
            sari_3:
            
            mov ecx,[copie]
            lodsd ;ca sa trecem de dword ul high din acest qword
            add byte[cnt_dwords],1
        
        loop repeta
        
        
        verificare:
            mov ecx,16
            mov byte[suma],0
            mov byte[cnt],0
            ;verificam partea inferioara
            repeta1:
                
                shr ax,1
                mov bh,byte[suma]
                adc byte[suma],0
                cmp bh,byte[suma]
                je nu_e_continuu_1
                jmp sari_nu_e_continuu_1
                nu_e_continuu_1:
                    mov byte[suma],0
                sari_nu_e_continuu_1:
                
                cmp byte[suma],3
                jne sari_1
                
                ;daca a ajuns aici avem un sir 111
                mov byte[suma],0
                add byte[cnt],1
                
                sari_1:
            
            loop repeta1
            
            ;acum verificam in continuare partea superioara
            mov ecx,16

            repeta2:
                
                shr dx,1
                mov bh,byte[suma]
                adc byte[suma],0
                cmp bh,byte[suma]
                je nu_e_continuu_2
                jmp sari_nu_e_continuu_2
                nu_e_continuu_2:
                    mov byte[suma],0
                sari_nu_e_continuu_2:
                
                cmp byte[suma],3
                jne sari_2
                
                ;daca a ajuns aici avem un sir 111
                mov byte[suma],0
                add byte[cnt],1
                
                sari_2:
            
            loop repeta2
        jmp gata_verificare
        
        ;afisam in baza 2 fiecare dword
        mov esi,dwords
        mov ecx,0
        mov cl, byte[cnt_dwords]
        
        repeta_afisare:
        
            ;pun in edi pe fiecare byte cate un bit din dword, voi obtine bitii invers, apoi afisez inversat
            mov edi,rez
            lodsd ;in dx:ax avem primul dword
            mov [copie],ecx
            mov ecx,16
            repeta_3:
                shr ax,1
                mov bl,0
                adc bl,0 ;in bl avem ultima cifra din dword ul nostru
                mov byte[edi],bl
                inc edi
            loop repeta_3
            
            mov ecx,16
            repeta_4:
                shr dx,1
                mov bl,0
                adc bl,0 ;in bl avem ultima cifra din dword ul nostru
                mov byte[edi],bl
                inc edi
            loop repeta_4
            
            ;acum afisez edi de la capat la inceput
            repeta_afisare_invers:
                    dec edi
                    cmp edi,rez-1
                    je gata
                    
                    mov ebx,0
                    mov bl,byte[edi]
                    
                    push ebx
                    push dword format_d
                    call [printf]
                    add esp,4*2
                    jmp repeta_afisare_invers
                    
            gata:
            push dword[spatiu]
            push dword format_c
            call [printf]
            add esp,4*2
            
            
            mov ecx,[copie]
        loop repeta_afisare
        
    
        ; exit(0)
        push    dword 0      ; push the parameter for exit onto the stack
        call    [exit]       ; call exit to terminate the program
