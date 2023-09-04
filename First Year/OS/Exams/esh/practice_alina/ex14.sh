# 14. Write a shell script that receives as argument a natural number N and generate N text files:
# - the name of the files will be of the form: file_X, where X={1,2,…, N}
# - each generated file will contain online lines between X and X+5 of the file /etc/passwd

#!/bin/bash

# check if the number of arguments is correct
if [ $# -ne 1 ]; then
    echo "Usage: $0 N"
    exit 1
fi

# check if the argument is a natural number
if ! [[ $1 =~ ^[0-9]+$ ]]; then
    echo "Error: the argument must be a natural number"
    exit 1
fi

# generate the files
for i in $(seq 1 $1); do
    # generate the file name
    file_name="file_$i"
    # generate the file content
    sed -n "$i,$((i+5))p" /etc/passwd > $file_name
done

# display the generated files
ls -l file_*

# remove the generated files
# rm file_*