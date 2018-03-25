#!/bin/sh

cd web
npm i
npm run clean
npm run vendor
npm run develop
