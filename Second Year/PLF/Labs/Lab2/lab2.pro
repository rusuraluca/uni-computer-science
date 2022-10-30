%7.
%a. Write a predicate to compute the intersection of two sets.
%domains
%	set=integer*
%predicates
%	intersection(L1-set, L2-set, L-intersection set)
%	ispartof(integer, set)
%flow model(i, i, o)
%mathematical model:
%	intersection([l1...ln], [ll1...lln]) = { [], if L1 or L2 is empty
%									     = { l1 U intersection([l2...ln], [ll1...lln]), if l1 in L2
%									     = { intersection([l2...ln], [ll1...lln]), otherwise

% true if E in list
ispartof(E,[E|_]). 
% recursive call to search
ispartof(E,[_|T]) :- ispartof(E,T).

% if L1 becomes empty 
intersection([],_,[]).
intersection([E1|T1], L2, [E1|T2]) :- ispartof(E1, L2), intersection(T1, L2, T2).
intersection([_|T1], L2, T2) :- intersection(T1, L2, T2).

%b. Write a predicate to create a list (m, ..., n) of all integer numbers from the interval[m, n].
%domains
%	list=integer*
%interval(integer,integer,list)
%flow model(i, i, o)
%mathematical model:
%	interval(m, n) = { [], if m > n
%				   = { m, if m = n 
%				   = { m U interval(m+1, n), if m < n

interval(_, _, []).
interval(M, N, L) :- M > N, L = [].
interval(M, N, L) :- M = N, L = [M].
interval(M, N, [M|T]) :- M < N, M2 = M+1, interval(M2, N, T).