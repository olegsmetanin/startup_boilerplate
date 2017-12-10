#!/bin/sh
go get -u github.com/golang/dep/cmd/dep
dep init
dep ensure -update

export SHELL=bash
export GOLDFLAGS='-w -linkmode external -extldflags "-static"'

mkdir -p ./serviceproto/go
mkdir -p ./serviceproto/ts
mkdir -p ./serviceproto/js

chokidar 'serviceproto/*.proto' --initial -c 'echo "Reduild proto" && protoc --plugin=protoc-gen-ts=/usr/bin/protoc-gen-ts --plugin=protoc-gen-go=${GOPATH}/bin/protoc-gen-go -I ./serviceproto/ --js_out=import_style=commonjs,binary:./serviceproto/js --go_out=plugins=grpc:./serviceproto/go --ts_out=service=true:./serviceproto/ts serviceproto/*.proto && cp -r serviceproto/ front/' &
  
chokidar 'cmd/api/*.go' 'api/**/*.go' 'serviceproto/go/*.proto' --initial -c 'echo "Reduild api" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/api ./cmd/api' &

chokidar 'cmd/site/*.go' 'serviceproto/go/*.proto' --initial -c 'echo "Reduild site" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/site ./cmd/site' &

wait

