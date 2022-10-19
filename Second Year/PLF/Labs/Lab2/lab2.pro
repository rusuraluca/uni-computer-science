%Write a predicate to compute the intersection of two sets.
%domains
%	set=integer*
%predicates
%	intersection(set,set,set)
%	ispartof(integer,set)
%flow model(i, i, o)

ispartof(E,[E|_]).
ispartof(E,[_|T]) :- ispartof(E,T).

intersection([],_,[]).
intersection([X|M1],M,[X|M2]) :- ispartof(X,M), intersection(M1,M,M2).
intersection([X|M1],M,M2) :- not(ispartof(X,M)), intersection(M1,M,M2).

%Write a predicate to create a list (m, ..., n) of all integer numbers fromthe interval[m, n].
%domains
%	list=integer*
%interval(integer,integer,list)
%flow model(i, i, o)

interval(M,N,L) :- M>N, L=[].
interval(M,N,L) :- M=N, L=[M].
interval(M,N,[H|T]) :- M<N, H=M, M2=M+1, interval(M2,N,T).
