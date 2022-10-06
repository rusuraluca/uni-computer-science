A=[1 0 -2; 2 1 3; 0 1 0];
B=[2 1 1; 1 0 -1; 1 1 0];
C=A-B;
fprintf("Matrix C is:\n");
fprintf("%2d %2d %2d\n",C);
fprintf("\n");

D=A*B;
fprintf("Matrix D is:\n");
fprintf("%2d %2d %2d\n",D);
fprintf("\n");

E=A.*B;
fprintf("Matrix E is:\n");
fprintf("%2d %2d %2d\n",E);
fprintf("\n");
