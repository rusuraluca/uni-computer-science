# 	Find recursively in a directory all ".c" files having more than 500 lines. Stop after finding 2 such files.
if [ $# -lt 1 ]; then
    echo "Insufficient arguments"
    exit 1
fi

count=2
for f in $(find $1); do
    if [ -f $f ]; then
        # "c program text" is the output of file command for C files, might be different for other opperating systems
        if file $f | grep -E -q "c program text"; then
          if [ $(wc -l $f | awk '{print $1}') -gt 500 ]; then
                echo $f
                count=$((count-1))
                if [ $count -eq 0 ]; then
                    break
                fi
            fi
        fi
    fi
done