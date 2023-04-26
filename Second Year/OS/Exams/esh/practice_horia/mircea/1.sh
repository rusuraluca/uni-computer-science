# Write a bash script that counts all the C files from a given directory and all of its subdirectories.
if [ ! $# -eq 1 ]; then
    echo "Wrong number of arguments."
    exit 1
fi

find $1 -type f | file -f - | grep -E -c "c program text"