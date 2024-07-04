%C. Write a PROLOG program that generates the list of all subsets with at least N elements such
%that the value of sum of all elements from each subset is divisible with 3, from a list of integers.
%Write the mathematical models and flow models for the predicates used. For example, for the list
%L=[2,3,4] and N=1 ⇒ [[3],[2,4],[2,3,4]] (not necessarily in this order).

% suma(l1l2..ln) ->
%	-> if n = 0 then 0
%	-> otherwise suma(l2l3..ln) + l1

% compute the sum of the elements of a list
% suma(L:List, SC:Number, S:Number)
% (i, i, o) - determinist
suma([], SC, SC).
suma([H|T], SC, S):-
    SC1 is SC + H,
    suma(T, SC1, S).

% insert(l1l2..ln, E) ->
% 	-> U i = 0,n l1..liEli+1..ln

% insert an element in a list
% insert(E:Number, L:List, R:List
% (i,i,o) - non-determinist
insert(E, L, [E|L]).
insert(E, [H|T], [H|R]):-
    insert(E, T, R).

% subset(l1l2..ln) ->
%	-> if n = 0 then null
%	-> U i = 1,n j = i,n lil(i+1)..l(j-1)lj

% compute all the subsets of a set
% subset(L:List, R:List)
% (i, o) - non-determinist
subset([], []).
subset([H|T], [H|R]):-
    subset(T, R).
subset([_|T], R):-
    subset(T, R).

% lenghtSum(l1l2..ln, len, sum) ->
% 	-> if n = 0 then (0,0)
%	-> otherwise (1 + lengthSum(l2..ln)1, l1 + lenghtSum(l2..ln)2)

% Compute both the legth and the sum of a list
% lengthSum(L:List, Len:Number, Sum:Number)
% (i, o, o) - determinist
lengthSum([], 0, 0).
lengthSum([H|T], Len + 1, Sum + H):-
    lengthSum(T, Len, Sum).

% cond(l1l2..ln, K) ->
%	-> if lengthSum(l1l2..ln, len, sum)1 < K or lengthSum(l1l2..ln, len, sum)2 % 3 != 0 then false
%	-> otherwise true

% Check if a list meets the condition of the problem
% cond(L:list, N:number)
% (i, i) - determinist
cond(L, N):-
    lengthSum(L, Len, Sum),
    Len1 is Len,
    Sum1 is Sum,
    Len1 >= N,
    Sum1 mod 3 =:= 0.

% oneSol(l1l2..ln, K) ->
%	-> return subset(l1l2..ln) where cond(s1s2..sm) is true (s1s2..sm being a return list of subset(l1l2..ln))

% Compute one solution of the problem
% oneSol(L:List, N:Number, R:List)
% (i, i, o) - non-determinist
oneSol(L, N, R):-
    subset(L, X),
    cond(X, N),
    R = X.

% Compute all the solution of the problem
% allSol(L:List, N:Number, R:List)
% (i, i, o) - determinist
allSol(L, N, R):-
    findall(S1, oneSol(L, N, S1), R).
    