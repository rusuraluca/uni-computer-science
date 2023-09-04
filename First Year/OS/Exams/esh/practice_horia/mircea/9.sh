# Write a script that extracts from all the C source files given as command line arguments the included libraries and saves them in a file
filename="included_libraries.txt"
if [ $# -eq 0 ]; then
  echo "No arguments provided."
  exit 1
fi

for A; do
  if file $A | grep -E -q "c program text"; then
    grep -E "#include <" $A >> $filename
  fi
done

files=$(sort $filename | uniq)
echo "$files" > $filename