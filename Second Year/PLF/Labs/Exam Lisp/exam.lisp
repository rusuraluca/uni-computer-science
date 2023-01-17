; type 2
; path from root to a given node x


; my_append(l1l2...ln, p1p2...pm) =
; { p1p2...pm, if n = 0
; { {l1} U my_append(l2...ln, p1p2...pm), otherwise
(defun my_append (l p)
    (cond
        ((null l) p)
        (t (cons (car l) (my_append (cdr l) p)))
    )
)


; check_existence(l1l2...ln, e) =
; { nil, if n = 0
; { true, if l1 = e
; { check_existence(l1, e) or check_existence(l2...ln, e), if l1 is a list
; { check_existence(l2...ln, e), otherwise
(defun check_existence (l e)
    (cond
        ((null l) nil)
        ((equal (car l) e) t)
        ((listp (car l)) (or (check_existence (car l) e) (check_existence (cdr l) e)))
        (t (check_existence (cdr l) e))
    )
)


; l1 - car
; l2 - cdr
; l3 - caddr


; path(l1l2l3, e) =
; { nil, if l1l2l3 is empty
; { l1, if l1 = e
; { {l1} U path(l2), if check_existence(l2) = true
; { {l1} U path(l3), if check_existence(l3) = true
(defun path(l e)
  (cond
    ((null l) nil)
    ((equal (car l) e) (list (car l)))
    ((check_existence (cadr l) e) (cons (car l) (path (cadr l) e)))
    ((check_existence (caddr l) e) (cons (car l) (path (caddr l) e)))
  )
)


(print (path '(A(B)(C(D)(E))) 'D) ) ; (A C D)

(print (path '(A(B)(C(D)(E))) 'E) ) ; (A C E)

(print (path '(A(B)(C(D)(E))) 'A) ) ; (A)

(print (path '(A(B)(C(D)(E))) 'C) ) ; (A C)

(print (path '(A(B)(C(D)(E))) 'B) ) ; (A B)
