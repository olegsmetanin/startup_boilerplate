package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	apisvc "github.com/olegsmetanin/startup_boilerplate/srv/apisvc"
	proto "github.com/olegsmetanin/startup_boilerplate/srv/proto"
	utils "github.com/olegsmetanin/startup_boilerplate/srv/utils"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/metadata"
)

const grpcport = 8081
const restport = 8080

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

// AuthInterceptor code
func AuthInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	meta, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, grpc.Errorf(codes.Unauthenticated, "missing context metadata")
	}

	log.Println("meta", meta)
	//if len(meta["token"]) != 1 {
	//return nil, grpc.Errorf(codes.Unauthenticated, "invalid token")
	//}
	//if meta["token"][0] != "valid-token" {
	//return nil, grpc.Errorf(codes.Unauthenticated, "invalid token")
	//}

	return handler(ctx, req)
}

func main() {

	log.Println("APIServce started")

	grpcServer := grpc.NewServer(grpc.UnaryInterceptor(AuthInterceptor))

	proto.RegisterEchoServiceServer(grpcServer, &apisvc.Server{})

	userSvcConn, err := grpc.Dial("usersvc:8081", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer userSvcConn.Close()
	userSVC := proto.NewUserServiceClient(userSvcConn)

	proto.RegisterUserServiceServer(grpcServer, &apisvc.Server{UserSVC: userSVC})

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

	restMux := http.NewServeMux()

	grpcGatewayMux := runtime.NewServeMux()

	dopts := []grpc.DialOption{grpc.WithInsecure()}

	err = proto.RegisterEchoServiceHandlerFromEndpoint(ctx, grpcGatewayMux, fmt.Sprintf(":%d", grpcport), dopts)
	if err != nil {
		fmt.Printf("serve: %v\n", err)
		return
	}

	err = proto.RegisterUserServiceHandlerFromEndpoint(ctx, grpcGatewayMux, fmt.Sprintf(":%d", grpcport), dopts)
	if err != nil {
		fmt.Printf("serve: %v\n", err)
		return
	}

	workdir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Work dir:", workdir)

	restPath := utils.GetEnv("REST_PATH", "")
	log.Println("REST_PATH:", restPath)

	restMux.HandleFunc(restPath+"/public.swagger.json", func(w http.ResponseWriter, r *http.Request) {
		log.Println("send public.swagger.json")
		http.ServeFile(w, r, "proto/public.swagger.json")
	})

	restMux.HandleFunc(restPath+"/extauth/fb/login", apisvc.HandleFBLogin)

	restMux.HandleFunc(restPath+"/extauth/fb/callback", apisvc.HandleFBCallback)

	restMux.Handle(restPath+"/", http.StripPrefix(restPath, grpcGatewayMux))

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", restport),
		Handler: allowCORS(restMux),
	}

	if err := httpServer.ListenAndServe(); err != nil {
		grpclog.Fatalf("failed starting http server: %v", err)
	}
}
