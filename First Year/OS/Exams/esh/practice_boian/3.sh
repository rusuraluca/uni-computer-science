# Find recursively in a directory, all the files with the extension ".log" and sort their lines (replace the original file with the sorted content).
if [ $# -lt 1 ]; then
    echo "Insufficient arguments"
    exit 1
fi

for f in $(find $1); do
    files=$(file $f | grep -E ".log" | awk -F: '{print $1}')
    for file in $files; do
        sort $file > $file.sorted
    done
done