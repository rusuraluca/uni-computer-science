# Calculate the average of all process ids in the system per user.
proccesses_path="ps.fake.txt"

users=$(sed -E "s/UID/root/g" $proccesses_path | awk {'print $1'} | sort | uniq)

for user in $users; do
  sum=0
  values=$(grep -E "^$user" $proccesses_path | awk {'print $2'} | sort)
  cnt=$(grep -E -c "^$user" $proccesses_path)
  for value in $values; do
    sum=$(($sum + $value))
  done
  sum=$(($sum / $cnt))
  echo "The average PID value for $user is $sum"
done
