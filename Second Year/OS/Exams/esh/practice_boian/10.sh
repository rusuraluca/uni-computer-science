# Display the session count and full names of all the users who logged into the system this month, sorting the output by the session count in descending order. Use the -s and/or -t options of command last to get this month's sessions, and the command date to generate the required timestamp in the expected format.
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <month>"
#     exit 1
# fi

# MONTH=$(date | awk '{print $2}')
MONTH=Mar
echo $MONTH

grep -E $MONTH last.fake.txt | awk '{print $1}' | sort | uniq -c | sort -nr | awk '{print $2, $1}'