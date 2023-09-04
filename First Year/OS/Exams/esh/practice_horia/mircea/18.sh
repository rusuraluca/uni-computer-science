# Write a shell script that recieves any number of words as command line arguments, and continuously reads from the keyboard one file name at a time. The program ends when all words received as parameters have been found at least once across the given files.
if [ $# -eq 0 ]; then
  echo "Provide at least one word!"
  exit 1
fi

found_all=0
file_names=""
while [ $found_all -eq 0 ]; do
  read -p "File name: " file
  file_names="$file_names $file"
  found_all=1
  for word in $@; do
    found=0
    if grep -E -q "\<$word\>" $file_names; then
      echo "Found $word"
      found=1
    fi
    if [ $found -eq 0 ]; then
      found_all=0
    fi
  done
done

echo "All words found!"