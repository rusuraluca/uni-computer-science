#!/bin/bash

# Write a shell script that, for all the users in /etc/passwd, 
# creates a file with the same name as the username 
# and writes in it all the ip addresses from which that user has logged in. 
# (hint: use the last command to find the ip addresses).

#this code gets a last: illegal option -- i
#what is the correct version?

# check if the number of arguments is correct
if [ $# -ne 0 ]; then
    echo "Error: this script does not accept any arguments"
    exit 1
fi

# check if the file exists
if [ ! -f /etc/passwd ]; then
    echo "Error: /etc/passwd does not exist"
    exit 1
fi  

# check if the file is readable
if [ ! -r /etc/passwd ]; then
    echo "Error: /etc/passwd is not readable"
    exit 1
fi

# check if the file is empty
if [ ! -s /etc/passwd ]; then
    echo "Error: /etc/passwd is empty"
    exit 1
fi

# create a temporary file
temp_file=$(mktemp)

# read the users from the file
while read user; do
    # get the username
    username=$(echo $user | cut -d: -f1)
    # get the ip addresses
    last_output=$(last $username)
    ip_addresses=$(echo "$last_output" | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" | awk '{print $1}')
    # check if the file is empty
    if [ ! -z "$ip_addresses" ]; then
        # create the file
        touch $username
        # write the ip addresses to the file
        echo "$ip_addresses" > $username
    fi
done < /etc/passwd

# remove the temporary file
rm $temp_file

