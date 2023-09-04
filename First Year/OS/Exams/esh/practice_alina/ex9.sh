#!/bin/bash

# Create a bash script that displays every second the process count per user sorted descending 
# by process count for all users specified as command line arguments. 
# If no arguments are given, the script will display the process count per user for all users. 
# Validate usernames provided.

# check if the number of arguments is correct
if [ $# -gt 0 ]; then
    # check if the arguments are valid usernames
    for username in $@; do
        if ! id -u $username &> /dev/null; then
            echo "Error: $username is not a valid username"
            exit 1
        fi
    done
fi

# display the process count per user sorted descending by process count
while true; do
    # display the process count per user
    if [ $# -gt 0 ]; then
        ps -u $@ -o user= | sort | uniq -c | sort -nr
    else
        ps -e -o user= | sort | uniq -c | sort -nr
    fi
    # wait 1 second
    sleep 1
done
