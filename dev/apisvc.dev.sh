#!/bin/sh

inotifywait -m ./bin -e create |
    while read path action file; do
        # echo "The file '$file' appeared in directory '$path' via '$action'" 
        if [ $file = "apisvc" ] && [ $action = "CREATE" ]
        then
            jobs -p | xargs kill &>/dev/null
            (sleep 1; echo "Restart ./bin/apisvc"; ./bin/apisvc) &
        fi
    done
