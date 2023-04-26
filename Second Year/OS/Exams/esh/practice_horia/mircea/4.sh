# Write a bash script that sorts the file given as command line arguments in ascending order according to their file size in bytes.
#!/bin/bash
# du -H | sort -nr
for A; do
  if [ -f "$A" ]; then
    du -h "$A"
  fi
done | sort -nr