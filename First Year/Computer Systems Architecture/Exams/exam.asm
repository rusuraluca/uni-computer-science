; Se citesc dintr-un fisier caractere, pana la intalnirea caracterului !.
; Sa se afiseze pe ecran numarul vocalelor citite (fie n acest numar).
; Sa se afiseze primele maxim n caractere din fisier care nu sunt vocale.

bits 32

global start


extern exit, fopen, fread, fclose, printf
import exit msvcrt.dll
import fopen msvcrt.dll
import fread msvcrt.dll
import fclose msvcrt.dll
import printf msvcrt.dll

; our data is declared here (the variables needed by our program)
segment data use32 class=data
    file db "exam.txt", 0
    acces_mode db "r", 0
    descriptor dd -1

    msg db "no vocale: ", 0
    msg1 db "  text: ", 0

    len equ 100
    no_vocale dd 0   ; dd
    text times 100 db 0     ; sirul citit
    format db "%d", 0
    consoane resb 100       ; siul de consoane
    char_format db "%c", 0


; our code starts here
segment code use32 class=code
    start:
        mov eax, 0
        mov ebx, 0
        mov ecx, 0
        mov edx, 0

        ; open file
        push dword acces_mode
        push dword file
        call [fopen]
        add esp, 4*2

        mov [descriptor], eax
        cmp eax, 0
        je .final

        ; read from file
        push dword [descriptor]
        push dword len
        push dword 1
        push dword text
        call [fread]
        add esp, 4*4


        mov ecx, eax
        mov esi, text
        mov edi, consoane
        .loop:
            mov al, [esi]
            cmp al, '!'
            je .final

            cmp al, 'a'
            je .good

            cmp al, 'e'
            je .good

            cmp al, 'i'
            je .good

            cmp al, 'o'
            je .good

            cmp al, 'u'
            je .good

            cmp al, 'A'
            je .good

            cmp al, 'E'
            je .good

            cmp al, 'I'
            je .good

            cmp al, 'O'
            je .good

            cmp al, 'U'
            je .good

            cmp al, 'z'
            jg .not_vocale

            cmp al, 'r'
            jg .not_vocale

            cmp al, 'p'
            jg .not_vocale

            cmp al, 'v'
            jg .not_vocale

            cmp al, 'a'
            jg .not_vocale

            cmp al, 'A'
            jb .not_vocale

            cmp al, 'a'
            ja .next

            cmp al, 'Z'
            jb .next

            jmp .not_vocale
            jmp .next

            ; incrementam contorul de vocale
            .good:
                inc byte[no_vocale]
                mov byte [edi], al
                inc edi
                jmp .next

            .not_vocale:
                mov byte [edi], al
                inc edi

            .next:
                inc esi
                loop .loop


            ; face jump aici cand intalnim ! si printam msg "no vocale: "
            .final:
                push dword msg
                call[printf]
                add esp, 4


            ; dupa ce am parcurs sirul, printam no_vocale unde am calculat contorul vocalel
            push dword [no_vocale]
            push dword format
            call [printf]
            add esp, 4*2

            ; printam msg1 " text: "
            push dword msg1
            call[printf]
            add esp, 4

            ; facem stringul cerut doar cu consoane
            mov esi, consoane
            mov ecx, [no_vocale]
            .loop_2:
                push ecx
                mov ebx, 0
                mov bl, [esi]
                inc esi

                push dword ebx
                push dword char_format
                call [printf]
                add esp, 4*2

                pop ecx
            loop .loop_2


            ; inchidem fisierul
            push dword[descriptor]
            call [fclose]
            add esp, 4*1


        final:
            ; exit(0)
            push dword 0
            call [exit]
