#!/bin/sh
export SHELL=bash

#watchweb='(echo "Watch web" && cd web && npm i && npm run clean && npm run develop)'

#eval $watchweb &

  echo "$(date '+%Y/%m/%d %H:%M:%S') WebBuilder: started"
cd web
npm i
npm run clean
npm run vendor:build
npm run site:watch &
npm run app:watch &
while [ ! -f  ./src/ssrsvc/index.site.ejs ]; do sleep 1; done
npm run ssrsvc:watch &

wait
