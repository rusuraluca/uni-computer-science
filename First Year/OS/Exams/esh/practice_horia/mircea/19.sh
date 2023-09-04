# Write a shell script that, for all the users in /etc/passwd, creates a file with the same name as the username and writes in it all the ip addresses from which that user has logged in

users=$(awk '{print $1}' last.fake.txt | sed "s/UID/root/g" | sort | uniq)
echo $users
for user in $users; do
  echo $user
  # rm -f $user.txt
  grep -E "^$user" ps.fake.txt | awk '{print $3}' | sort | uniq > $user.txt
done