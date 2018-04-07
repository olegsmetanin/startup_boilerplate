#!/bin/sh

echo "Sync down"

rsync -avr \
--exclude='vendor/' \
--exclude='web/node_modules/' \
--exclude='mobile/node_modules/' \
--exclude='bin/' \
--exclude='.git/' \
--exclude='.vscode/' \
--exclude='tags' $1 .
