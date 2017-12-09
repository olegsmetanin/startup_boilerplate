#!/bin/sh

inotifywait -m ./bin -e create |
    while read path action file; do
        # echo "The file '$file' appeared in directory '$path' via '$action'" 
        if [ $file = "api" ] && [ $action = "CREATE" ]
        then
            echo "Restart ./bin/api"
            sleep 1
            pkill ./bin/api
            ./bin/api &
        fi
    done
