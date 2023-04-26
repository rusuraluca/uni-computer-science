# Write a bash script that receives a folder name as argument. Find recursively in the folder the number of times each file name is repeated.
if [ ! $# -eq 1 ]; then
  echo "Invalid number of arguments"
  exit 1
fi

find $1 -type f | awk -F/ '{print $NF}' | sort | uniq -c | sort -nr | awk '{print $2 " " $1}'