#!/bin/sh

# Wait for api source exists
#while [ ! -f ./mobile/api/api.ts ]; do sleep 1; done
cd mobile
yarn
yarn start
