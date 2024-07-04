% 1.a Write a predicate to determine the lowest common multiple of a list formed from integer numbers.
% mathematical model:
% instead of the Euclidean algorithm by subtraction, we continuously divide the bigger number by the smaller number
% gcd(a, b) = { b, a = 0
% 			  { gcd(b%a, a), otherwise
% domain:
% gcd(A:number, B:number, R:number)
% flow model:
% gcd(i, i, o)
gcd(0, B, B).
gcd(A, B, R):- B1 is B mod A,
    		   gcd(B1, A, R).

% mathematical model:
% lcm(a, b) = a * b / gcd(a, b)
% domain:
% lcm(A:number, B:number, R:number)
% flow model:
% lcm(i, i, o)
lcm(A, B, R):- gcd(A, B, RGCD),
			   R is A * B / RGCD.

% mathematical model:
% lcm_list(L) = { 1, L is empty
% 		        { lcm(l1, lcm_list(T)), otherwise
% domain:
% lcm_list(L:list, R:number)
% flow model:
% lcm(i, o)
lcm_list([], 1):-!.
lcm_list([H|T], LCM) :- lcm_list(T, LCM2),
                        lcm(H, LCM2, LCM).