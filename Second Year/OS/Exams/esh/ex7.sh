# Write a bash script that counts the number of exam and practice account per student name.
# Display the information sorted descending by account number.

#!/bin/bash

# the best way to do this is a one-liner consisting of multiple commands:
#grep -E "^((ex)|(yz))" /etc/passwd | awk -F: '{print $5}' | awk '{print $1}' | sort | uniq -c | sort -rn

# alternatives to the best solution exist, even if they are somewhat painful
# (user, value)

declare -A arr

for user in $(grep -E "^((ex)|(yz))" /etc/passwd | awk -F: '{print $5}' | awk '{print $1}'); do
    arr[$user]=$((arr[$user]+1))
done

for user in ${!arr[@]}; do
    echo ${arr[$user]}" "$user
done | sort -rn
