

# Write a shell script that receives as command line arguments a character sequence S that does not c    ontain whitespacesand, after the sequence S, there can be any number of arguments. For each argumen    t after the sequence S:
#     - if the argument is a regular file, the script will report if the file does NOT contain the se    quence S
#     - if the argument is a folder, the script will report if it contains an item (nonrecursive) wit    h the name equal to the character sequence S (where item can be a file, folder, link, etc)
#     - else, the script will append the argument to a file from the current directory with the same     name as the value of the sequence S

#!/bin/bash

if [ $# -lt 2 ]; then
    echo "Usage: $0 <sequence> <file1> <file2> ..."
    exit 1
fi

sequence=$1

for file in ${@:2}; do
    if [ -f $file ]; then
        if ! grep -q $sequence $file; then
            echo "$file does not contain $sequence"
        fi
    elif [ -d $file ]; then
        if [ -e $file/$sequence ]; then
            echo "$file contains $sequence"
        fi
    else
        echo $file >> $sequence
    fi
done

