# Find recursively in a given directory all the symbolic links, and report those that point to files/directories that no longer exist. Use option -L to test if a path is a symbolic link, and option -e to test if it exists (will return false if the target to which the link points does not exist)
if [ ! $# -eq 1 ]; then
  echo "Invalid number of arguments"
  exit 1
fi

for link in $(find $1 -type l); do
  echo $link
  if [ ! -e $link ]; then
    echo "domnle nu mai exista $link"
  fi
done