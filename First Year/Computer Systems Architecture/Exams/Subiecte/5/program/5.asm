;se da un sir de qwords si un n de la tastatura
;identifica al n+1 lea qword si stocheaza partrea superioada/inferioara daca n e par/impar
;dupa descompui in bytes si vezi cati de 1 are fiecare byte in repr binara, afisezi sirul sortat descrescator
bits 32 ; assembling for the 32 bits architecture

; declare the EntryPoint (a label defining the very first instruction of the program)
global start        

; declare external functions needed by our program
extern exit,scanf,printf               ; tell nasm that exit exists even if we won't be defining it
import exit msvcrt.dll
import scanf msvcrt.dll    ; exit is a function that ends the calling process. It is defined in msvcrt.dll
import printf msvcrt.dll                          ; msvcrt.dll contains exit, printf and all the other important C-runtime specific functions

; our data is declared here (the variables needed by our program)
segment data use32 class=data
    rez1 times 100 db -1
    s dq 1011101b,1122334455667788h,5566778811223344h,77788889h,12345678987654h,12345678h,9876543456789h
    lens equ $-s
    n dd -1
    format_d db '%d',0
    format_x db '%x',0
    copie dd -1
    doi db 2
    aux1 dd -1
    aux2 dd -1
    cnt db 0
    cnt_1 db 0
    rez times 100 db -1
 

; our code starts here
segment code use32 class=code
    start:
        ;scanf(format,variabile)
        push dword n
        push dword format_d
        call [scanf]
        add esp,4*2

        
        mov ebx,[n]
        mov esi,s
        
        mov edx, dword[esi+8*ebx+4]
        mov eax, dword[esi+8*ebx] ;in edx:eax avem qwordul pe care il vrem
        
        mov [aux2],edx
        mov [aux1],eax ;in aux2:aux1 e qwordul
        
        mov eax,ebx
        div byte[doi]
        cmp ah,1
        je impar
        
        ;aici inseamna ca e par/impar
        mov ax,[aux1+2]
        mov dx,[aux1] ;in dx:ax avem nr care ne trebuie
        
        impar:
            mov ax,[aux2]
            mov dx,[aux2+2] ;in dx:ax avem nr care ne trebuie
            
        sari:
        ;acum in eax avem partea care ne intereseaza
        mov esi,rez
        mov byte[esi],ah
        inc esi
        mov byte[esi],al
        inc esi
        mov byte[esi],dh
        inc esi
        mov byte[esi],dl
        
        mov ecx,4
        mov edi,rez1
        repeta:
            mov [copie],ecx
            mov ecx,4
            mov byte[cnt_1],0
            repeta1:
                lodsb
                mov byte[cnt],0
                shr al,1
                adc byte[cnt],0
                cmp byte[cnt],1
                je cnt_update
                jmp sari1
                cnt_update:
                    inc byte[cnt_1]
                sari1
                
            loop repeta1
            mov al,byte[cnt_1]
            stosb
            
            mov ecx,[copie]
        loop repeta
        
        ;in edi avem sirul de cnt de 1
        repeta2:
            dec edi
            cmp edi,rez1-1
            je gata
            
            ;daca nu e gata, afisez nr de 1
            mov eax,0
            mov al,byte[edi]
            
            push eax
            push format_d
            call [printf]
            add esp,4*2
            jmp repeta2
        
        
        gata:
    
        ; exit(0)
        push    dword 0      ; push the parameter for exit onto the stack
        call    [exit]       ; call exit to terminate the program
