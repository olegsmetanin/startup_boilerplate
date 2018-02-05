#!/bin/sh
export SHELL=bash
export GOLDFLAGS='-w -linkmode external -extldflags "-static"'

mkdir -p ./srv/proto

assembleproto='echo "Assemble proto" && cat ./proto/all.prototpl | sed -e "/#PRIVATEONLY/,/#!PRIVATEONLY/d" | sed -e "/#PUBLICONLY/d; /#!PUBLICONLY/d" > ./proto/public.proto && cat ./proto/all.prototpl | sed -e "/#PUBLICONLY/,/#!PUBLICONLY/d" > ./proto/private.proto'

runprotoc='echo "Rebuild proto" &&  protoc --plugin=protoc-gen-go=${GOPATH}/bin/protoc-gen-go -I /usr/local/include -I $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I ./proto/ --go_out=plugins=grpc:./srv/proto --grpc-gateway_out=logtostderr=true:./srv/proto proto/private.proto &&  protoc -I /usr/local/include -I $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I ./proto/ --swagger_out=logtostderr=true:./proto proto/public.proto && java -jar /tmp/swagger-codegen-cli.jar generate -i ./proto/public.swagger.json -l typescript-fetch -o ./web/src/api'

eval $assembleproto

eval $runprotoc

dep init
dep ensure -update

chokidar 'proto/*.prototpl' -c "$assembleproto" &

chokidar 'proto/*.proto' -c "$runprotoc" &

chokidar 'cmd/apisvc/*.go' 'srv/apisvc/**/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Rebuild APIService" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/apisvc ./cmd/apisvc' &

chokidar 'cmd/sitesvc/*.go' 'srv/sitesvc/**/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Rebuild SiteService" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/sitesvc ./cmd/sitesvc' &

chokidar 'cmd/usersvc/*.go' 'srv/usersvc/**/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Rebuild UserService" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/usersvc ./cmd/usersvc' &

wait

