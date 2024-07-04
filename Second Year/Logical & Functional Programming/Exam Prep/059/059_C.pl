lengthSum([], 0, 0).
lengthSum([H|T], 1 + Len, H + Sum):-
    lengthSum(T, Len, Sum).

insertElement(L, E, [E|L]).
insertElement([H|T], E, [H|R]):-
    insertElement(T, E, R).

arrangements([E|_], 1, [E]).
arrangements([_|T], K, R):-
    arrangements(T, K, R).
arrangements([H|T], K, R1):-
    K > 1,
    K1 is K - 1,
    arrangements(T, K1, R),
    insertElement(R, H, R1).

oneSol(L, K, _):-
    lengthSum(L, Len, Sum),
    Len1 is Len,
    Len1 < K,
    Sum1 is Sum,
    Sum1 mod 2 =:= 1,
    !.

oneSol(L, K, R):-
    arrangements(L, K, R),
    lengthSum(R, _, Sum),
    Sum1 is Sum,
    Sum1 mod 2 =:= 1.

oneSol(L, K, R):-
    K1 is K + 2,
    oneSol(L, K1, R).

allSol(L, R):-
    findall(RL, oneSol(L, 2, RL), R).