# Write a script that receives program/process names as command line arguments. The script will monitor all the processes in the system, and whenever a program with one of those names is run, the script will kill it and display a message
if [ $# -eq 0 ]; then
   echo "No arguments passed"
   exit 1
fi

while true; do
  for a; do
      ps -ef | grep $a | awk '{print $2}' | xargs kill -9
  done
  sleep 3
done