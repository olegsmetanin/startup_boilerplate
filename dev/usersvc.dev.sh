#!/bin/sh

SVC=./bin/usersvc

while [ ! -f $SVC ]; do sleep 1; done

while true; do
  $SVC &
  PID=$!
  inotifywait -e CLOSE_NOWRITE,CLOSE $SVC &>/dev/null
  echo "Restarting $SVC"
  kill $PID
  sleep 1
done