(DEFUN replaceTree(L level E)
  (COND
   ((AND (ATOM L) (= (MOD level 2) 0)) E)
   ((ATOM L) L)
   (T (MAPCAR #'(LAMBDA(X)
                  (replaceTree X (+ level 1) E)
                  ) L
              )
      )
   )
)

(DEFUN mainReplaceTree (L E)
  (replaceTree L 0 E)
)