#!/bin/sh

echo "Sync up"

rsync -avr --checksum \
--exclude='vendor/' \
--exclude='web/node_modules/' \
--exclude='web/dist/' \
--exclude='mobile/node_modules/' \
--exclude='bin/' \
--exclude='.git/' \
--exclude='.vscode/' \
--exclude='tags' . $1
