(DEFUN removeNonNum(L level)
  (COND
   ((AND (ATOM L) (AND (NOT (NUMBERP L)) (= (mod level 2) 0))) NIL)
   ((ATOM L) (LIST L))
   (T (LIST (MAPCAN #' (LAMBDA (x)
                   (removeNonNum x (+ level 1))
                   ) L
              )
            )
      )
   )
)

(DEFUN main(L)
  (CAR (removeNonNum L 0))
)