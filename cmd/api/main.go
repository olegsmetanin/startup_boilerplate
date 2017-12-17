package main

import (
	"fmt"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	api "github.com/olegsmetanin/startup_boilerplate/srv/api"
	proto "github.com/olegsmetanin/startup_boilerplate/srv/proto"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
	"log"
	"net"
	"net/http"
	"strings"
)

const grpcport = 8081
const restport = 8082

func allowCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			if r.Method == "OPTIONS" && r.Header.Get("Access-Control-Request-Method") != "" {
				preflightHandler(w, r)
				return
			}
		}
		h.ServeHTTP(w, r)
	})
}

func preflightHandler(w http.ResponseWriter, r *http.Request) {
	headers := []string{"Content-Type", "Accept"}
	w.Header().Set("Access-Control-Allow-Headers", strings.Join(headers, ","))
	methods := []string{"GET", "HEAD", "POST", "PUT", "DELETE"}
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(methods, ","))
	return
}

func main() {

	log.Println("Hello api")

	grpcServer := grpc.NewServer()

	proto.RegisterEchoServiceServer(grpcServer, &api.Server{})

	go func() {
		listener, err := net.Listen("tcp", fmt.Sprintf(":%d", grpcport))
		if err != nil {
			log.Fatalf("failed to listen: %v", err)
		}

		if err := grpcServer.Serve(listener); err != nil {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	ctx := context.Background()

	mux := http.NewServeMux()

	gwmux := runtime.NewServeMux()

	dopts := []grpc.DialOption{grpc.WithInsecure()}

	err := proto.RegisterEchoServiceHandlerFromEndpoint(ctx, gwmux, fmt.Sprintf(":%d", grpcport), dopts)
	if err != nil {
		fmt.Printf("serve: %v\n", err)
		return
	}

	mux.HandleFunc("/echo.swagger.json", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "srv/proto/echo.swagger.json")
	})

	mux.Handle("/", gwmux)

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", restport),
		Handler: allowCORS(mux),
	}

	if err := httpServer.ListenAndServe(); err != nil {
		grpclog.Fatalf("failed starting http server: %v", err)
	}
}
