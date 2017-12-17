FROM golang:1.9.2-stretch

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

RUN apt-get install -y --no-install-recommends unzip

RUN apt-get install -y musl-tools

RUN apt-get install -y inotify-tools

ENV PROTOC_ZIP protoc-3.5.0-linux-x86_64.zip

RUN curl -OL https://github.com/google/protobuf/releases/download/v3.5.0/$PROTOC_ZIP \
  && unzip -o $PROTOC_ZIP -d /usr/local \
  && rm -f $PROTOC_ZIP

RUN go get -u github.com/golang/protobuf/protoc-gen-go

RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway

RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

RUN go get -u github.com/golang/dep/cmd/dep

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash - \
  && apt-get -y install nodejs

RUN npm install -g ts-protoc-gen

ENV SHELL bash

RUN npm install -g chokidar-cli

