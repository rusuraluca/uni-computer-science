bits 32
global start        

extern exit,printf
import exit msvcrt.dll
import printf msvcrt.dll

segment data use32 class=data
extern functie

sir dd -1,123456,0xabcdeff,0xabcdeff,0xcbcdeff,0xdbcdeff,0111010101b;sirul dublucuvintelor
len_sir equ ($  -sir)/4
sir_sume times len_sir db 0
aux dd 0
format_afisare db '%u ',0
new_line db 10,13,0
format_afisare_hex db '0x%x ',0
aux2 dd 0
ok db 0
limita dd 0
segment code use32 class=code
    start:
        ;functie(sir,sir_sume,len_sir)
        push dword len_sir
        push dword sir_sume
        push dword sir
        call functie
        add esp,4*3;Curatare stiva
        ;Afisam numerele din elemente pe ecran pentru a ne putea verifica
        mov ecx,len_sir
        mov esi,sir_sume

        repeta:
            mov [aux],ecx
            movzx eax,byte[ESI]
            inc esi
            ;printf(format_afisare,eax)
            push eax
            push dword format_afisare
            call [printf]
            add esp,4*2
            mov ecx,[aux]
        loop repeta
        ;printf(new_line)
        push dword new_line
        call [printf]
        add esp,4
        ;AFISAREA TUTUROR SECVENTELOR STRICT CRESCATOARE
        mov esi,sir_sume; Cu esi iteram pozitia de inceput
        mov edi,sir_sume;Cu edi iteram pozitia de final a sumei
        mov [limita],edi
        add dword[limita],len_sir-1
        repeta2:
            ;Verificam daca secventa ESI:EDI in lista este strict crescatoare
            mov byte[ok],1;Presupunem ca este strict crescatoare
            mov ecx,esi;Cu ecx ne plimbam in sirul de sume ESI:EDI
            inc ecx;Incepem de la al doilea element ca sa putem compara a[i-1]<a[i]
            cmp ecx,edi;Aici practic daca avem o secvente de un singur element, atunci ar trebui sarit
            je sari2
                repeta3:
                    ;cmp byte[ECX-1],byte[ECX]
                    mov al,[ECX-1]
                    cmp al,byte[ECX]
                    ;Daca e mai mic strict nu face nimic
                    jb sari
                    mov byte[ok],0;Nu avem secventa strict crescatoare
                    jmp final_repeta3
                    sari:
                    inc ecx
                cmp ecx,edi;Daca sunt egale atunci am ajuns la final
                je final_repeta3
                jmp repeta3
                final_repeta3:
                    ;Daca in ok a ramas 1 atunci avem o secventa crescatoare de la ESI, la EDI
                    cmp byte[ok],0;Atunci nu afiseaza
                    je sari4
                    ;Afisam secventa de la ESI la EDI
                        mov ecx,esi
                            repeta_4:
                            mov [aux2],ecx
                                ;Ca sa gasim indicele, trebuie sa scadem din ecx adresa de inceput
                                sub ecx,sir_sume
                                ;Acum in ecx avem indicele din sir
                                ;printf(format_afisare_hex,dword[sir+4*ecx]
                                push dword[sir+4*ecx]
                                push dword format_afisare_hex
                                call [printf]
                                add esp,4*2
                            mov ecx,[aux2]
                            inc ecx
                            cmp ecx,edi
                            je final_repeta_4
                            jmp repeta_4
                            final_repeta_4:
                                ;printf(new_line)
                                push dword new_line
                                call [printf]
                                add esp,4
                    sari4:
                sari2:
        ;CRESTEM IDEXII
            ;Daca edi a ajuns la final atunci crestem esi, si in edi punem esi
            cmp edi,[limita]
            jne nu_am_ajuns_final
            ;Am ajuns la final cu edi
            inc esi
            mov edi,esi
            jmp sari5
            nu_am_ajuns_final:
            ;Crestem edi
            inc edi
            sari5:
        cmp esi,dword[limita]
        je final_repeta2
        jmp repeta2
        final_repeta2:
        push    dword 0
        call    [exit]
