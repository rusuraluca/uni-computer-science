# Display all the mounted file systems who are either smaller than than 1GB or have less than 20% free space.
if [ ! $# -eq 1 ]
then
  echo "Wrong number of arguments"
  exit 1
fi

if [ ! -f $1 ]
then
  echo "File does not exist"
  exit 1
fi

awk {'print $2 $5 $6'} $1 | grep -E -v 'blocks' | sed "s/M/ /g" | sed "s/%/ /g" | awk '$1 < 1024 || $2 > 80 {print $3}' 

