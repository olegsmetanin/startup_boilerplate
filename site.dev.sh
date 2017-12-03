#!/bin/sh
go get -u github.com/golang/dep/cmd/dep
dep init
dep ensure -update
go get github.com/tockins/realize
realize start --install --run --name="site"

