# Write a bash script that keeps reading strings from the keyboard until the name of a readable regular file is given.
filename=""
read -p "Enter a filename: " filename
while [ ! -f "$filename" ]; do
    echo "$filename is not a file."
    read -p "Enter a filename: " filename
done
echo "$filename file exists."