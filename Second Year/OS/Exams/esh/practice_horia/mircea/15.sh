# Write a script that receives a directory as a command line argument. The script will delete all the C source files from the directory and will display all other text files sorted alphabetically.
if [ ! $# -eq 1 ]; then
  echo "Invalid number of arguments"
  exit 1
fi

for file in $(find $1 -type f); do
  if file $file | grep -q "c program text"; then
    rm $file
  fi
done

find $1 -type f | sort