package main

import (
	"fmt"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	api "github.com/olegsmetanin/startup_boilerplate/api"
	sp "github.com/olegsmetanin/startup_boilerplate/serviceproto/go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
	"log"
	"net"
	"net/http"
)

const grpcport = 8081
const webgrpcport = 8082

func main() {

	log.Println("Hello api")

	grpcServer := grpc.NewServer()

	sp.RegisterEchoServiceServer(grpcServer, &api.Server{})

	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", grpcport))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

	wrappedServer := grpcweb.WrapServer(grpcServer)
	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHttp(resp, req)
	}

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", webgrpcport),
		Handler: http.HandlerFunc(handler),
	}

	if err := httpServer.ListenAndServe(); err != nil {
		grpclog.Fatalf("failed starting http server: %v", err)
	}

}
