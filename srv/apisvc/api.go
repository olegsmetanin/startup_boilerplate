package apisvc

import (
	proto "github.com/olegsmetanin/startup_boilerplate/srv/proto"
	"golang.org/x/net/context"
	"log"
)

// Server type
type Server struct {
	UserSVC proto.UserServiceClient
}

// Echo service
func (s *Server) Echo(ctx context.Context, in *proto.StringMessage) (*proto.StringMessage, error) {
	log.Println("Got a request")
	log.Println(ctx)
	return &proto.StringMessage{Value: "Hello From a GRPC Method (GRPC WEB Go Server Served) " + in.Value}, nil
}

// RegisterUser service
func (s *Server) RegisterUser(ctx context.Context, in *proto.RegisterUserRequest) (*proto.RegisterUserResponse, error) {
	log.Println("Got a request in api")
	log.Println(ctx)
	r, err := s.UserSVC.RegisterUser(ctx, in)
	return r, err
	//return &proto.RegisterUserResponse{Id: "qwe"}, nil
}
