# Write a bash script that receives any number of command line arguments.
# For each argument, if it is a regular file, print its size in bytes

#!/bin/bash

# this option also works to iterate through the command line arguments
# while [ $# -gt 0 ]; do
#    echo $1
#    shift
# done


for a; do
    if [ -f $a ]; then
        du -b $a # this may not work on MacOS as du does not have the -b option there
        # wc -c $a this is one option that should work on MacOS
    fi
done
