#!/bin/bash

echo -n > out

for arg; do
    if [ -f $arg ]; then
        if file $arg | grep -E -q "text"; then
            head -n 1 $arg >> out
        fi
    fi
done

