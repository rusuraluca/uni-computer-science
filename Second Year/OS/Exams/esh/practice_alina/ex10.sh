#!/bin/bash

# Write a shell script that receives any number of words as command line arguments, 
# and continuously reads from the keyboard one file name at a time. 
# The program ends when all words received as parameters have been found at least once across the given files.

# check if the number of arguments is correct
if [ $# -eq 0 ]; then
    echo "Usage: $0 word1 word2 ..."
    exit 1
fi

# create a temporary file
temp_file=$(mktemp)

# create a temporary file for the words
words_file=$(mktemp)

# add the words to the words file
for word in $@; do
    echo $word >> $words_file
done

# read the file names from the keyboard
while read file_name; do
    # check if the file exists
    if [ ! -f $file_name ]; then
        echo "Error: $file_name is not a file"
        continue
    fi
    # check if the file is readable
    if [ ! -r $file_name ]; then
        echo "Error: $file_name is not readable"
        continue
    fi
    # check if the file is empty
    if [ ! -s $file_name ]; then
        echo "Error: $file_name is empty"
        continue
    fi
    # check if the file contains the words
    for word in $(cat $words_file); do
        if grep -q $word $file_name; then
            # remove the word from the words file
            sed -i -e "/$word/d" $words_file
            # check if the words file is empty
            if [ ! -s $words_file ]; then
                # remove the temporary files
                rm $temp_file $words_file
                exit 0
            fi
        fi
    done
done

# display the words that were not found
echo "The following words were not found:"
cat $words_file

# remove the temporary files
rm $temp_file $words_file
