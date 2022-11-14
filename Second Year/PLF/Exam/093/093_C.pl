insert([], E, Last, [E]):-
    abs(E - Last) =< 3.
insert([H|T], E, Last, [E,H|T]):- 
    abs(E - H) =< 3,
    abs(E - Last) =< 3.
insert([H|T], E, _, [H|R]):-
    Last1 is H,
    insert(T, E, Last1, R).

perm([], []).
perm([H|T], R):-
    perm(T, R1),
    insert(R1, H, H, R).

oneSol(L, R):-
    perm(L, R).

allSol(L, R):-
    findall(R1, oneSol(L,R1), R).
    