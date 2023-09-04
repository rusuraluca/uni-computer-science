# Write a script that finds recursively in the current folder and displays all the regular files that have write permisions for everybody (owner, group, other). Then the script removes the write permissions from everybody.

for file in `find . -type f`; do
  chmod a+w $file
done

# ls -l .

# for file in `find . -type f`; do
#   if ls -l $file | grep -E -q "^-.w..w..w-"; then
#     echo $file
#     chmod a-w $file
#   fi
# done
