# Write a bash script that counts all the lines of code in the C files from the directory given as command-line argument, excluding lines that are empty or contain only spaces.
#!/bin/bash
# This counts only from the given directory, not from subdirectories.
total=0
for f in $(ls "$1"); do
  if file $1/$f | grep -E -q "c program text"; then
    nr_lines=$(grep -E -v -c "^[[:space:]]*$" $1/$f)
    total=$((total+nr_lines))
  fi
done
echo "Total lines of C Code from this directory: $total"