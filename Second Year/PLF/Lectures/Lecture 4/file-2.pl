predicat(a, b).
predicat(c, d).
predicat(e, f).
toate :-
  predicat(X, Y),
  write(X),write(Y),nl,
  fail.
toate1 :-
  predicat(X, Y),
  write(X),write(Y),nl.
