# Consider a file containing a username on each line. Generate a comma-separated string with email addresses of the users that exist. The email address will be obtained by appending "@scs.ubbcluj.ro" at the end of each username. Make sure the generated string does NOT end in a comma.
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

res=""
lines=$(cat $1)

for line in $lines
do
  res="$res,$line@scs.ubbcluj.ro"
done

echo $res | sed 's/^,//'