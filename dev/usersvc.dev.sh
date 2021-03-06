#!/bin/sh

SVC=./bin/usersvc

while [ ! -f $SVC ]; do sleep 1; done

while true; do
  $SVC &
  PID=$!
  filewatch -t 3 -filenames $SVC
  kill $PID
  echo "$(date '+%Y/%m/%d %H:%M:%S') UserService: killed"
done