# 15. Write a bash script that finds recursively in the current folder 
# and displays all the regular files that have write permissions for everybody (owner, group, other). 
# Then the script removes the write permissions from everybody. 

# find all files with write permissions for everybody
find . -type f -perm -o+w

# remove write permissions from everybody
find . -type f -perm -o+w -exec chmod o-w {} \;

# find all files with write permissions for everybody
find . -type f -perm -o+w
