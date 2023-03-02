; se da sir de qwords, verific daca dword ul inferior are minim 2 secvente de 111 in binar
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
    copie dd -1
    suma db 0
    cnt db 0
    s dq 1110111b, 1000000000h, 0ABCD0002E7FCh,5
    lens equ $-s
    copie3 dd -1
    ok db 0
    dword_inferior dd -1
    cnt_edi db 0
    format_d db '%d',0
    format_c db '%c',0
    afis db 0
    copie4 dd 0
    spatiu dd ' '
    
    rez times 100 db -1

; our code starts here
segment code use32 class=code
    start:
    
        ;verifica care dintre ele se incadreaza
        mov ecx, lens/8
        mov esi,s
        mov edi, dwords
        
        repeta:
            mov [copie],ecx
            mov byte[ok],0
            mov byte[suma],0
            mov byte[cnt],0
            jmp repeta_un_qword
            
            
            aici_inapoi:
            ;verific daca sunt 2 secvente 111 minim
            cmp byte[cnt],2
            jb nu_sunt
            
            ;aici intra daca sunt minim 2 secvente 111
            ;atunci stocam word ul inferior in edi
            mov eax,[dword_inferior]
            mov dword[edi],eax
            add edi,4
            add byte[cnt_edi],1
            
            nu_sunt:
            
            mov ecx,[copie]
        loop repeta
        
        jmp final
        repeta_un_qword:
                cmp byte[ok],0
                jne sari
                ;daca suntem la dword ul inferior il stocam in caz ca ne trebuie mai tarziu
                mov eax,dword[esi]
                mov dword[dword_inferior],eax
                
                sari:
                lodsd ;in eax am a doua parte din qword ul din sir, apoi la urm parcurgere prima parte
                mov ecx,16
                repeta_cnt:
                    shr eax,1
                    mov bh,byte[suma]
                    adc byte[suma],0
                    cmp bh,byte[suma]
                    je nu_e_continuu
                    
                    ;aici intra daca e continuu
                    cmp byte[suma],3
                    jne nu_modifica ;daca nu a ajuns la secventa 111 dar 1 sunt continuu sa nu modifica nimic
                    
                    ;aici intra daca a gasit 111
                    inc byte[cnt] ; creste numarul de secvente 111 din qword
                    mov byte[suma],0 ; actualizeaza suma sa numere de la capat
                    jmp nu_modifica ;sa sara peste nu e continuu
                    
                    nu_e_continuu:
                        mov byte[suma],0
                        
                    nu_modifica:
                loop repeta_cnt
                
                cmp byte[ok],0 ;daca a facut doar a doua parte din qword si nu a trecut prin prima, ok este tot 0,altfel e 1
                je mai_fa_odata
                
                jmp final_repeta_un_qword
                mai_fa_odata:
                    mov byte[ok],1
                    jmp repeta_un_qword
            final_repeta_un_qword:
            jmp aici_inapoi
            
            final:
            
            ;trebuie sa afisez sirul dwords in baza 2
            mov ecx,0
            mov cl,byte[cnt_edi] ; atatea dwords avem de afisat  
            mov esi,dwords
            repeta_afisare:
                mov edi,rez
                lodsd ;in eax avem primul dword
                mov [copie],ecx
                mov ecx,16
                repeta_dword:
                    shr eax,1
                    mov bl,0
                    adc bl,0 ;in bl avem ultima cifra din dword ul nostru
                    mov byte[edi],bl
                    inc edi
                loop repeta_dword
                
                ;afisam invers edi
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
