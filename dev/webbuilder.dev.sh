#!/bin/sh
export SHELL=bash

watchweb='(echo "Watch web" && cd web && npm i && npm run clean && npm run develop)'

eval $watchweb &

wait
