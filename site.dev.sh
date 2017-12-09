#!/bin/sh

inotifywait -m ./bin -e create |
    while read path action file; do
        # echo "The file '$file' appeared in directory '$path' via '$action'" 
        if [ $file = "site" ] && [ $action = "CREATE" ]
        then
            echo "Restart ./bin/site"
            sleep 1
            pkill ./bin/site
            ./bin/site &
        fi
    done
