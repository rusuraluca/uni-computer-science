# Write a script that receives as command line arguments pairs consisting of a filename and a word. For each pair, check if the given word appears at least 3 times in the file and print a corresponding message.
if [ $# -lt 2 ]; then
  echo "Not enough arguments."
  exit 1
fi

while [ $# -gt 1 ]; do
  if [ ! -f $1 ]; then
    echo "$1 is not a file."
  else 
    count=$(grep -E -o -c "\<$2\>" $1)
    if [ $count -ge 3 ]; then
      echo "$2 appears at least 3 times in $1."
    else
      echo "$2 does not appear at least 3 times in $1."
    fi
  fi
  shift 2
done

if [ $# -eq 1 ]; then
  echo "Last pair is incomplete"
fi