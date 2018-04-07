#!/bin/sh

SVC=./web/dist/ssrsvc.js

while true; do
  while [ ! -f $SVC ]; do sleep 1; done
  (node $SVC) &
  PID=$!
  echo "PID: $PID"
  filewatch -t 3 -filenames $SVC
  echo "Restarting $SVC"
  kill $PID
done