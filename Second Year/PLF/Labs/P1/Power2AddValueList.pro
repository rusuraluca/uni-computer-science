% 1. b. Write a predicate to add a value v after 1-st, 2-nd, 4-th, 8-th, … element in a list.
% mathematical model:
% pow2add(l1...ln, v, pos, index) = { [], n = 0
%									{ l1 U v U insert_pow(l2...ln, v, pos * 2, index + 1), index = pos
%	                                { l1 U insert_pow(l2...ln, v, pos, index + 1), pos != index
% domain:
% pow2add(L:list, V:number, P:number, I:number, R:list)
% flow model:
% pow2add(i, i, i, i, o)
pow2add([], _, _, _, []).
pow2add([H|T], V, P, I, [H,V|R]):- P =:= I,
                                   NEWP is P*2,
                                   NEWI is I+1,
                                   pow2add(T, V, NEWP, NEWI, R).
pow2add([H|T], V, P, I, [H|R]):- P =\= I,
                                 NEWI is I+1,
                                 pow2add(T, V, P, NEWI, R).