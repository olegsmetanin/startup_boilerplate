#!/bin/sh

SVC=./bin/sitesvc

while [ ! -f $SVC ]; do sleep 1; done

while true; do
  while [ ! -f $SVC ] || [ ! -f ./web/dist/index.site.html ]; do sleep 1; done
  $SVC &
  PID=$!
  filewatch -t 3 -filenames $SVC
  kill $PID
  echo "$(date '+%Y/%m/%d %H:%M:%S') SiteService: killed"
done
