#!/bin/sh
export SHELL=bash
export CGO_ENABLED=0 GOOS=linux
export GOLDFLAGS='-s -w'

mkdir -p ./srv/proto

assembleproto='echo "Assemble proto" && cat ./proto/all.prototpl | sed -e "/#PRIVATEONLY/,/#!PRIVATEONLY/d" | sed -e "/#PUBLICONLY/d; /#!PUBLICONLY/d" > ./proto/public.proto && cat ./proto/all.prototpl | sed -e "/#PUBLICONLY/,/#!PUBLICONLY/d" > ./proto/private.proto'

runprotoc='echo "Rebuild proto" && protoc --plugin=protoc-gen-go=${GOPATH}/bin/protoc-gen-go -I /usr/local/include -I $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I ./proto/ --go_out=plugins=grpc:./srv/proto --grpc-gateway_out=logtostderr=true:./srv/proto proto/private.proto &&  protoc -I /usr/local/include -I $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I ./proto/ --swagger_out=logtostderr=true:./proto proto/public.proto && java -jar /tmp/swagger-codegen-cli.jar generate -i ./proto/public.swagger.json -l typescript-fetch -o ./web/src/api'

eval $assembleproto

eval $runprotoc

dep init
dep ensure -update

filewatch -t 2 -filenames 'proto/*.prototpl' --command='$assembleproto' &

filewatch -t 2 -filenames 'proto/*.proto' --command='$runprotoc' &

# Waiting for frontend
while [ ! -f ./web/dist/index.site.html ]; do sleep 1; done

filewatch -t 2 -filenames 'cmd/apisvc/*.go,srv/apisvc/**/*.go,srv/common/**/*.go,srv/proto/*.go' --initial --command='echo "APIService: build" && CGO_ENABLED=0 go build --ldflags "$GOLDFLAGS" -o ./bin/apisvc ./cmd/apisvc && echo "APIService: build completed"' &
#chokidar 'cmd/apisvc/*.go' 'srv/apisvc/**/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "APIService: build" && CGO_ENABLED=0 go build --ldflags "$GOLDFLAGS" -o ./bin/apisvc ./cmd/apisvc && echo "APIService: build completed"' &

filewatch -t 2 -filenames 'cmd/sitesvc/*.go,srv/sitesvc/**/*.go,srv/common/**/*.go,srv/proto/*.go' --initial --command='echo "SiteService: build" && CGO_ENABLED=0 go build --ldflags "$GOLDFLAGS" -o ./bin/sitesvc ./cmd/sitesvc && echo "SiteService: build completed"' &

filewatch -t 2 -filenames 'cmd/usersvc/*.go,srv/usersvc/**/*.go,srv/common/**/*.go,srv/proto/*.go' --initial --command='echo "UserService: build" && CGO_ENABLED=0 go build --ldflags "$GOLDFLAGS" -o ./bin/usersvc ./cmd/usersvc && echo "UserService: build completed"' &

wait

