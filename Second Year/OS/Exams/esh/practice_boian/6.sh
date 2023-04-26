# Find recursively in a directory, all the files that have write permissions for everyone. Display their names, and the permissions before and after removing the write permission for everybody. You will need to use chmod's symbolic permissions mode, instead of the octal mode we have used in class. The the chmod manual for details.
if [ ! $# -eq 1 ]
then
  echo "Wrong number of arguments"
  exit 1
fi

# Command to set write to all of them again, to test the program
for f in $(find $1 -type f); 
do
  chmod o+w $f
done

for f in $(find $1 -type f -perm -o=w); 
do
    ls -l $f | awk '{print $1 " " $9}'
    chmod o-w $f
    ls -l $f | awk '{print $1 " " $9}'
done