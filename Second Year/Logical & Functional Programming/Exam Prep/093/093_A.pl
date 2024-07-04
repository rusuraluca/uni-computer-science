f([], 0).

f([H|T], S):- f(T, S1), f_aux(H, S1, S).

f_aux(H, S, Rez):- H < S, !, Rez is H + S.
f_aux(_, S, S + 2).

f1([], 0).
f1([H|T],S):-f1(T,S1),H<S1,!,S is H+S1.
f1([_|T],S):-f1(T,S1), S is S1+2.