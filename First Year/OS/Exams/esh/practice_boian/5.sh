# Write a script that receives dangerous program names as command line arguments. The script will monitor all the processes in the system, and whenever a program known to be dangerous is run, the script will kill it and display a message.
if [ $# -eq 0 ]; then
    echo "Provide at least one name"
    exit 1
fi
while true; do
    for name in $@; do
        if grep -E -q $name ps.fake.txt; then
            echo "Killing $name"
            # Since the processes are in a fake file, we can't kill them, the program would crash
            # This is the command that would kill them if the processes were real
            # kill $(ps -e | grep -E $name | awk '{print $1}')
        fi
    done
    sleep 1
done