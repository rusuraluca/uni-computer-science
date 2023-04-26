#! /bin/bash


users = ""

for arg; do
	if [ -z "$users" ]; then
		users="$arg"
	else
		users="$users,$arg"
	fi
done

while true; do
	ps -f -u $users | awk 'NR>1{print$1}' | sort | uniq -c
	sleep 1
done
