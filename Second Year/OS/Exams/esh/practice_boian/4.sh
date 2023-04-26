# Find recursively in a given directory all the symbolic links, and report those that point to files/directories that no longer exist. Use operator -L to test if a path is a symbolic link, and operator -e to test if it exists (will return false if the target to which the link points does not exist)
if [ $# -lt 1 ]; then
    echo "Insufficient arguments"
    exit 1
fi

for f in $(find $1); do
    if [ -L $f ]; then
        echo $f
    fi
done