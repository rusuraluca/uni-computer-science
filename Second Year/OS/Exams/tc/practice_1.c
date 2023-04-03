/* RO: Copiati acest fisier intr-un alt fisier numit solve.c
 * si rezolvati problemele compilare (erori si warning-uri) si rulare;
 * Programul trebuie sa citeasca o matrice dintr-un fisier dat ca argument
 * la linia de comanda si sa calculeze suma elementelor de pe fiecare coloana.
 *
 * EN: Copy this file into a file named solve.c and
 * fix the compilation errors/warnings and the runtime problems;
 * The program will read one matrix from a file provided from
 * the command line, and then will calculate the sum of the elements from each column.
 *
 * Ex:
 * Place the following 3 lines in a file named in.txt:
 * 2 4
 * 1 2 3 4
 * 5 6 7 8
 *
 * Compile using:
 * gcc -Wall -g solve.c -o exe
 *
 * Run with:
 * valgrind ./exe in.txt
 *
 * Expected result (the program may also print the input matrix, which is fine):
 * 6 8 10 12
 */

 #include <stdio.h>
 #include <stdlib.h>

 void printMatrix(int **m, int rows, int cols, char name) {
     int i, j;
     printf("Matrix %c:\n",name);
     for (i = 0; i < rows; i++) {
         for (j = 0; j < cols; j++) {
             printf("%d ", m[i][j]);
         }
         printf("\n");
     }
 }

 void printArray(int *a, int len, char name) {
     int i;
     printf("Array %c:\n", name);
     for (i = 0; i < len; i++) {
         printf("%d ", a[i]);
     }
     printf("\n");
 }

 void sum(int **x, int *y, int rows, int cols) {
     int i, j;
     for (i = 0; i < cols; i++) {
         y[i] = 0;
         for (j = 0; j < rows; j++) {
             y[i] += x[j][i];
         }
     }
 }

 int main(int argc, char **argv) {
     system("leaks solve");
     int **x, *y, i, j, rows, cols;
     FILE *f;

     f = fopen(argv[1], "r");

     if (argc != 2) {
         printf("Please provide one filename\n");
         exit(0);
     }

     fscanf(f, "%d%d", &rows, &cols);

     x = malloc(sizeof(int*) * rows);

     for (i = 0; i < rows; i++) {
         x[i] = malloc(sizeof(int) * cols);
     }
     for (i = 0; i < rows; i++) {
         for (j = 0; j < cols; j++) {
             fscanf(f, "%d", &x[i][j]);
         }
     }

     fclose(f);

     printMatrix(x, rows, cols, 'x');

     y = malloc(sizeof(int) * cols);

     sum(x, y, rows, cols);

     printArray(y, cols, 'y');

     for(i = 0; i < cols; i++) {
         free(x[i]);
     }
     free(y);

     return 0;
 }
