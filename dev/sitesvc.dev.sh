#!/bin/sh

SVC=./bin/sitesvc

while [ ! -f $SVC ]; do sleep 1; done

while true; do
  while [ ! -f $SVC ] || [ ! -f ./web/dist/index.ssr.html ] || [ ! -f ./web/dist/sitemeta.json ] || [ ! -f ./web/dist/appmeta.json ]; do sleep 1; done
  $SVC &
  PID=$!
  inotifywait -e CLOSE_NOWRITE,CLOSE $SVC &>/dev/null
  echo "Restarting $SVC"
  kill $PID
  sleep 1
done
