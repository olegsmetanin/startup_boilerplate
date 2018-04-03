#!/bin/sh

SVC=./bin/sitesvc

while [ ! -f $SVC ]; do sleep 1; done

while true; do
  while [ ! -f $SVC ] || [ ! -f ./web/dist/index.site.html ]; do sleep 1; done
  $SVC &
  PID=$!
  inotifywait -e CLOSE_NOWRITE,CLOSE $SVC &>/dev/null
  kill $PID
  sleep 1
  echo "Restarting $SVC"
done
