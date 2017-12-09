#!/bin/sh
go get -u github.com/golang/dep/cmd/dep
dep init
dep ensure -update

export SHELL=bash
export GOLDFLAGS='-w -linkmode external -extldflags "-static"'

chokidar 'serviceproto/*.proto' --initial -c 'echo "Reduild proto" && protoc -I serviceproto/ --go_out=plugins=grpc:serviceproto serviceproto/*.proto & protoc -I serviceproto/ --plugin=protoc-gen-ts=/usr/bin/protoc-gen-ts --ts_out=service=true:serviceproto serviceproto/*.proto && cp -r serviceproto/ front/' &

chokidar 'cmd/api/*.go' 'api/**/*.go' 'serviceproto/*.proto' --initial -c 'echo "Reduild api" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/api ./cmd/api' &

chokidar 'cmd/site/*.go' 'serviceproto/*.proto' --initial -c 'echo "Reduild site" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/site ./cmd/site' &

wait

