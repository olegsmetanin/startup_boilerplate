#!/bin/sh

SVC=./web/dist/ssrsvc.js

while true; do
  while [ ! -f $SVC ]; do sleep 1; done
  node $SVC &
  PID=$!
  inotifywait -e MODIFY $SVC
  kill $PID
  sleep 1
  echo "Restarting $SVC"
done