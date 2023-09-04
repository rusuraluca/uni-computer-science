# 21. Create a bash script that finds all the text files in a specified folder 
# (the current folder if there is no specified folder). 
# For all such files, t/he script will report the filesize, permissions and number of unique lines.

#!/bin/bash

if [ $# -eq 0 ]; then
    dir="."
else
    dir=$1
fi

for file in `find $dir -type f`; do
    if [ `file -b $file | grep -c "text"` -eq 1 ]; then
        echo "File: $file"
        echo "Size: `stat -c %s $file`"
        echo "Permissions: `stat -c %a $file`"
        echo "Unique lines: `cat $file | sort | uniq | wc -l`"
        echo
    fi
done
