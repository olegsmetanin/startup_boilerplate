FROM golang:1.10.0-alpine3.7

RUN apk add --no-cache bash unzip nodejs git

ENV SHELL bash

# FIX Error: could not get uid/gid
RUN npm config set unsafe-perm true

# A few reasons for installing distribution-provided OpenJDK:
#
#  1. Oracle.  Licensing prevents us from redistributing the official JDK.
#
#  2. Compiling OpenJDK also requires the JDK to be installed, and it gets
#     really hairy.
#
#     For some sample build times, see Debian's buildd logs:
#       https://buildd.debian.org/status/logs.php?pkg=openjdk-8

# Default to UTF-8 file.encoding
ENV LANG C.UTF-8

# add a simple script that can auto-detect the appropriate JAVA_HOME value
# based on whether the JDK or only the JRE is installed
RUN { \
		echo '#!/bin/sh'; \
		echo 'set -e'; \
		echo; \
		echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \
	} > /usr/local/bin/docker-java-home \
	&& chmod +x /usr/local/bin/docker-java-home
ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk/jre
ENV PATH $PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin

ENV JAVA_VERSION 8u151
ENV JAVA_ALPINE_VERSION 8.151.12-r0

RUN set -x \
	&& apk add --no-cache \
		openjdk8-jre="$JAVA_ALPINE_VERSION" \
	&& [ "$JAVA_HOME" = "$(docker-java-home)" ]

# If you're reading this and have any feedback on how this image could be
# improved, please open an issue or a pull request so we can discuss it!
#
#   https://github.com/docker-library/openjdk/issues

# https://github.com/facebook/watchman/issues/546#issuecomment-377604755
# RUN apk add --no-cache build-base automake autoconf linux-headers && \
#   git clone https://github.com/facebook/watchman.git /tmp/watchman-src && \
#   cd /tmp/watchman-src && \
#   git checkout v4.7.0 && \
#   ./autogen.sh && \
#   ./configure --enable-statedir=/tmp --without-python --without-pcre && \
#   make && \
#   make install &&
#   rm -r /tmp/watchman-src

RUN wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.2.3/swagger-codegen-cli-2.2.3.jar -O /tmp/swagger-codegen-cli.jar

ENV PROTOC_ZIP protoc-3.5.1-linux-x86_64.zip

# Get protobuf includes from release
RUN wget https://github.com/google/protobuf/releases/download/v3.5.1/$PROTOC_ZIP \
 && unzip -o $PROTOC_ZIP -d /usr/local \
 && rm -f $PROTOC_ZIP

# Here is the protobuf 3.4.1-r1
RUN apk add --no-cache protobuf

RUN go get -u github.com/golang/protobuf/protoc-gen-go

RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway

RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

RUN go get -u github.com/golang/dep/cmd/dep

RUN npm install -g ts-protoc-gen

RUN npm install -g chokidar-cli

ENV FILEWATCH_VERSION 0.0.4

RUN wget https://github.com/olegsmetanin/filewatch/releases/download/$FILEWATCH_VERSION/filewatch-linux.tar.gz -O - | tar -xz -C /usr/local/bin
