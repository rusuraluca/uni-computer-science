bits 32 ; assembling for the 32 bits architecture

; declare the EntryPoint (a label defining the very first instruction of the program)
global start        

; declare external functions needed by our program
extern exit,printf               ; tell nasm that exit exists even if we won't be defining it
import exit msvcrt.dll
import printf msvcrt.dll

; our data is declared here (the variables needed by our program)
segment data use32 class=data
sir dd 1234A678h,12785634h,1A4D3C2Bh
len_sir equ ($-sir)/4
sir2 times len_sir dw 0
cnt dd 0
format_afisare db '%d',0
; our code starts here
segment code use32 class=code
    start:
        ;fiecare word din sir2 trebuie sa fie concatenarea octetului high din cuvantul high, si octetul high din cuvantul low
        mov ecx,len_sir
        mov esi,sir
        mov edi,sir2
        repeta:
                ;mov byte[edi+0],byte[esi+2]
                ;[esi+1] adresa byte-ului high al cuvantului low
                mov al,byte[esi+1]
                mov byte[edi+0],al
                ;mov byte[edi+1],byte[esi+3]
                ;[esi+3] adresa byte-ului high din cuvantul high
                mov al,byte[esi+3]
                mov byte[edi+1],al
                add esi,4
                add edi,2
        loop repeta
        mov ecx,len_sir*2
        mov esi,sir2
        
        repeta2:
            mov al,byte[esi]
            inc esi
            cmp al,0
            mov ebx,8
            je final_cat_timp
                cat_timp:
                shl al,1
                adc dword[cnt],0
                
                dec ebx
                cmp ebx,0
                jne cat_timp
            final_cat_timp:
        loop repeta2
        ;printf(format_afisare,cnt)
        push dword [cnt]
        push dword format_afisare
        call [printf]
        add esp,4*2
        push    dword 0
        call    [exit]
