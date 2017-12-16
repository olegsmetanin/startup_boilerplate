#!/bin/sh
go get -u github.com/golang/dep/cmd/dep
dep init
dep ensure -update

export SHELL=bash
export GOLDFLAGS='-w -linkmode external -extldflags "-static"'

mkdir -p ./srv/proto
mkdir -p ./web/proto

chokidar 'proto/*.proto' --initial -c 'echo "Reduild proto" && protoc --plugin=protoc-gen-ts=/usr/bin/protoc-gen-ts --plugin=protoc-gen-go=${GOPATH}/bin/protoc-gen-go -I ./proto/ --js_out=import_style=commonjs,binary:./web/proto --go_out=plugins=grpc:./srv/proto --ts_out=service=true:./web/proto proto/*.proto' &

chokidar 'cmd/api/*.go' 'srv/api/**/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Reduild api" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/api ./cmd/api' &

chokidar 'cmd/site/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Reduild site" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/site ./cmd/site' &

wait

