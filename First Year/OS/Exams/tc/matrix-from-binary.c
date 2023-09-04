#include <stdio.h>
#include <stdlib.h>	
#include <unistd.h>
#include <fcntl.h>

int main(int argc, char** argv) {
    system("leaks exe");
    int fd;
    int rows=0, cols=0, i, j;
    int** m;

    if(argc <= 1) {
        fprintf(stderr, "No input file specified");
        exit(1);
    }

    fd = open(argv[1], O_RDONLY);
    if(fd == -1) {
        perror("Failed to open input file");
        exit(1);
    }

    if(read(fd, &rows, sizeof(int)) <= 0) {
        perror("Could not read the number of rows");
        exit(1);
    }

    if(read(fd, &cols, sizeof(int)) <= 0) {
        perror("Could not read the number of columns");
        exit(1);
    }	
    m = (int**)malloc(rows*sizeof(int));
    for(i=0; i<rows; i++) {
	m[i] = (int*)malloc(sizeof(int));
	for(j=0; j<cols; j++) {
	    read(fd, &m[i][j], sizeof(int));	
            printf("%d ", m[i][j]);
        }
        printf("\n");
    }
    free(m);

    close(fd);
    return 0;
}
