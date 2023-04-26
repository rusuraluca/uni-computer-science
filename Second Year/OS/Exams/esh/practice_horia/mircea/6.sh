# Write a script that reads filenames until the word "stop" is entered. For each filename, check if it is a text file and if it is, print the number of words on the first line.
filename=""
read -p "Enter a filename: " filename
while [ ! "$filename" = "stop" ]; do
    if [ -f "$filename" ]; then
      if file "$filename" | grep -q "text"; then
        # echo "The number of words on the first line is: $(head -n 1 "$filename" | wc -w)"
        echo $filename
        awk 'NR==1 {print "The number of words on the first line is", NF}' $filename
      else
        echo "$filename is not a text file."
      fi
    fi
    read -p "Enter a filename: " filename
done
echo "Done."