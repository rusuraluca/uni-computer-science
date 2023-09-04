# Write a bash script that counts all the lines of code in the C files from the directory given as command-line argument and all its subdirectories, excluding lines that are empty or contain only spaces.
# This counts for all the directories and subdirectories.
if [ ! $# -eq 1 ]; then
    echo "Wrong number of arguments."
    exit 1
fi

if [ ! -d "$1" ]; then
    echo "Parameter is not a folder"
    exit 1
    fi
total=0
for file in $(find $1 -type f | file -f - | grep -E "c program text" | awk -F: '{print $1}'); do
    total=$(($total + $(grep -E -v -c "^[[:space:]]*$" $file)))
done
echo "Total number of C Code from all the subdirectories: $total"
