#!/bin/sh
reflex -g serviceproto/*.proto -s -- sh -c 'protoc -I serviceproto/ --go_out=plugins=grpc:serviceproto serviceproto/*.proto & protoc -I serviceproto/ --plugin=protoc-gen-ts=/usr/bin/protoc-gen-ts --ts_out=service=true:serviceproto serviceproto/*.proto && cp -r serviceproto/ front/'

