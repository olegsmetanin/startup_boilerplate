package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	proto "github.com/olegsmetanin/startup_boilerplate/srv/proto"
	usersvc "github.com/olegsmetanin/startup_boilerplate/srv/usersvc"
	"google.golang.org/grpc"
	"log"
	"net"
)

const grpcport = 8081
const dbType = "postgres"
const connectionString = "host=pg user=postgres dbname=postgres sslmode=disable password=postgres"

func main() {

	log.Println("UserService started")

	db, err := gorm.Open(dbType, connectionString)

	//db.AutoMigrate(&usersvc.User{})

	grpcServer := grpc.NewServer()

	proto.RegisterUserServiceServer(grpcServer, &usersvc.Server{DB: db})

	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", grpcport))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
