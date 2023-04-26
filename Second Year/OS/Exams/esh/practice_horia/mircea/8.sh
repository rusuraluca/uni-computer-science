# Write a bash script that sorts all files given as command line arguments descending by size.
if [ $# -eq 0 ]; then
  echo: "No arguments provided."
  exit 1
fi

files=""

for A; do
  if [ -f "$A" ]; then
    files="$files $A"
  fi
done

du $files | sort -nr

