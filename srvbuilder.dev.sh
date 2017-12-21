#!/bin/sh
export SHELL=bash
export GOLDFLAGS='-w -linkmode external -extldflags "-static"'

mkdir -p ./srv/proto

# runprotoc='echo "Rebuild proto" && protoc --plugin=protoc-gen-ts=/usr/bin/protoc-gen-ts --plugin=protoc-gen-go=${GOPATH}/bin/protoc-gen-go -I /usr/local/include -I $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I ./proto/  --js_out=import_style=commonjs,binary:./web/src/proto --go_out=plugins=grpc:./srv/proto --ts_out=service=true:./web/src/proto --grpc-gateway_out=logtostderr=true:./srv/proto --swagger_out=logtostderr=true:./srv/proto proto/*.proto && java -jar /tmp/swagger-codegen-cli.jar generate -i ./srv/proto/echo.swagger.json -l typescript-fetch -o ./web/src/restapi'

runprotoc='echo "Rebuild proto" && protoc --plugin=protoc-gen-ts=/usr/bin/protoc-gen-ts --plugin=protoc-gen-go=${GOPATH}/bin/protoc-gen-go -I /usr/local/include -I $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis -I ./proto/ --go_out=plugins=grpc:./srv/proto --grpc-gateway_out=logtostderr=true:./srv/proto --swagger_out=logtostderr=true:./srv/proto proto/*.proto && java -jar /tmp/swagger-codegen-cli.jar generate -i ./srv/proto/echo.swagger.json -l typescript-fetch -o ./web/src/api'

eval $runprotoc

dep init
dep ensure -update

chokidar 'proto/*.proto' -c "$runprotoc" &

chokidar 'cmd/api/*.go' 'srv/api/**/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Rebuild api" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/api ./cmd/api' &

chokidar 'cmd/site/*.go' 'srv/common/**/*.go' 'srv/proto/*.go' --initial -c 'echo "Rebuild site" && CC=$(which musl-gcc) go build --ldflags "$GOLDFLAGS" -o ./bin/site ./cmd/site' &

wait

