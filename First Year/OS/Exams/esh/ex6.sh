# Write a bash script that receives a single argument.
# If the argument is a directory, search recursively through it and display all C source files found.
# If the argument is not a directory, print a message.

#!/bin/bash

if [ $# -ne 1 ]; then
    echo "The script requires exactly one argument"
    exit 1
fi

if [ ! -d $1 ]; then
    echo "The argument is not a directory"
    exit 1
fi

# alternatively, find $1 -type f will return only regular files and the if [ -f $f ] is unnecessary
for f in $(find $1); do
    if [ -f $f ]; then
        # depending on the system "C source" may not be the exact thing that the file command provides for C source files
        # this is a case of "test for yourself and see" what is the output of file for a C file and use that in the grep
        if file $f | grep -E -q "C source"; then
            echo $f
        fi
    fi
done

