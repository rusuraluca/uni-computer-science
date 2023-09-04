#!/bin/bash
# ./script.sh arg1 arg2

found=false
files=""
while ! $found; do
    read -p "Please enter a filename:" file
    if [ -f $file ]; then
        if [ -z "$files" ]; then
            files=$file
        else
            files="$files $file"
        fi
        found=true
        for arg; do
            if ! grep -E -q "$arg" $files; then
                found=false
            fi
        done
    fi
done

echo "Files: $files"
echo "Args: $@"
