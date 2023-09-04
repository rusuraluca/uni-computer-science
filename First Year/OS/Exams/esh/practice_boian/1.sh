# Display a report showing the full name of all the users currently connected, and the number of processes belonging to each of them.
names=$(grep -E "still" last.fake.txt | awk '{print $1}')

for name in $names

do
  eval=$(awk '{print $1}' ps.fake.txt | grep -E $name | wc -l)
  echo $name $eval
done
