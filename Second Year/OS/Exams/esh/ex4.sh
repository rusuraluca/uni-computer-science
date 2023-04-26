#!/bin/bash

while [ $# -ge 2 ]; do
    file=$1
    word=$2
    if [ $(grep -E -o "\<$word\>" $file | wc -l) -ge 3 ]; then
        echo "Word $word appears at least 3 times in file $file"
    fi
    shift 2
done

if [ $# -eq 1 ]; then
    echo "This is odd"
fi
#!/bin/bash
