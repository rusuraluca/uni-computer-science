# Write a bash script that calculates the sum of the sizes (in bytes) of all regular files in a folder given as a parameter.(use test to check if the folder exists and if a given file is a regular file)
if [ ! $# -eq 1 ]; then
    echo "Wrong number of arguments."
    exit 1
fi

if [ ! -d "$1" ]; then
    echo "Not a directory."
    exit 1
fi

sum=0
for file in $(find "$1" -type f); do
  
  sum=$((sum + $(du $file | awk {'print $1'})))
done
echo "$sum"