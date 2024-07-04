% sumSequence (l1l2..ln, c1c2..cn, s1s2..sm) ->
%	-> if n = 0 and found = 0 then s1s2..sm
%	-> if n = 0 and found = 1 then sumSequence(s1s2..sm, 0, x1x2..xq)
%	-> if l1 = l2 sumSequence(l3..ln, 1, s1s2..sm U l1+l2)
% 	-> otherwise sumSequence(l2..ln, found, s1s2..sm)

insertAtEnd([], E, [E]).

insertAtEnd([H|T], E, [H|S]):-
    insertAtEnd(T, E, S).

computeConsecutive([], _, X, Y):-
    X = 0,
    Y = [].

computeConsecutive([H|T], E, X, Y):-
    H =\= E,
    X = 0,
    Y = [H|T].
computeConsecutive([_|T], E, X + E, Y):-
    computeConsecutive(T, E, X, Y).
    

% sumSequence(L:List, found:Number, S:List)
% (i o o) - determinist
% List -> the input list
% found -> 1 or 0 indicates if any consecutive values were equal
% S -> the solution


sumSequence([], 0, []).


sumSequence([H1, H2|T],1 , [X1|S]):-
    H1 =:= H2,
    computeConsecutive([H1, H2|T], H1, X, L),
    X1 is X,
    sumSequence(L, _, S),
    !.

sumSequence([H|T], Found, [H|S]):-
    sumSequence(T, Found, S).

main(L, S):-
    sumSequence(L, Found, S1),
    Found =:= 1,
    main(S1, X),
    S = X,
    !.

main(L, S):-
    S = L.

                
                
                