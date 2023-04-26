# Create a bash script that finds all the text files in a specified folder (the current folder if there is no specified folder). For all such files, the script will report the filesize, permissions and number of unique lines.
if [ $# -gt 1 ]; then
  echo "Provide at most one folder!"
  exit 1
fi

directory="."

if [ $1 ]; then
  if [ ! -e $1 ]; then
    mkdir $directory
  fi
  directory=$1
fi


for file in $(ls $directory); do
  if [ -f $file ]; then
    echo $file
    file_size=$(du -h $file | awk '{print $1}')
    file_permissions=$(ls -l $file | awk '{print $1}')
    file_unique_lines=$(cat $file | sort | uniq | wc -l)
    echo "$file_size $file_permissions $file_unique_lines"
  fi
done