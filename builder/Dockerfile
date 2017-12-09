FROM golang:1.9.2-stretch

ENV PROTOC_ZIP protoc-3.3.0-linux-x86_64.zip

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

RUN apt-get install -y --no-install-recommends unzip

RUN apt-get install -y musl-tools

RUN apt-get install -y inotify-tools

RUN curl -OL https://github.com/google/protobuf/releases/download/v3.3.0/$PROTOC_ZIP \
  && unzip -o $PROTOC_ZIP -d /usr/local bin/protoc \
  && rm -f $PROTOC_ZIP

RUN go get -u github.com/golang/protobuf/protoc-gen-go

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash - \
  && apt-get -y install nodejs

RUN npm install -g ts-protoc-gen

ENV SHELL bash

RUN npm install -g chokidar-cli

