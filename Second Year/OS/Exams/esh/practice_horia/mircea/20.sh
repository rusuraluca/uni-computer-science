#  Create a bash script that displays every second the process count per user sorted descending by process count for all users specified as command line arguments. If no arguments are given, the script will display the process count per user for all users.
if [ $# -eq 0 ]; then
  for user in $(ps aux | less | awk '{print $1}' | sed "s/USER/root/g" | sort | uniq -c | sort -nr | awk '{print $2}'); do
    val=$(ps aux | grep -E -c "^$user")
    echo $user $val
    sleep 1
  done
  exit 0
fi

for user; do
  val=$(ps aux | grep -E -c "^$user")
  echo $user $val
  sleep 1
done