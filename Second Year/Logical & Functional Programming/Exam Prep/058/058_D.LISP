
; replaceValues(L, level) ->
;    -> if L is number and level % 2 = 1 then L - 1
;    -> if L is atom then L
;    -> otherwise U i = 1,n replaceValues(Li) if L is a list of form(L1L2..Ln)

(DEFUN replaceValues (L level K)
  (COND
   ((AND (AND (AND (ATOM L) (= 1 (MOD level 2))) (NUMBERP L)) (> L K)) (- L 1))
   ((ATOM L)  L)
   (T (MAPCAR #' (lambda (x)
                   (replaceValues x (+ level 1) K)
                   ) L
              )
      )
   )
)


(DEFUN replaceValuesMain(L K)
  (replaceValues L 0 K)
)
