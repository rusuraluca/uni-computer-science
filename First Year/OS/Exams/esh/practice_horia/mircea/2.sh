for A; do
  if [ -f "$A" ]; then
    echo "$A is a file"
  elif [ -d "$A" ]; then
    echo "$A is a directory"
  elif echo "$A" | grep -qE "^[0-9]+$"; then
    echo "$A is a number"
  else
    echo "$A is something else"
  fi
done