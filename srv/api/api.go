package api

import (
	proto "github.com/olegsmetanin/startup_boilerplate/srv/proto"
	"golang.org/x/net/context"
	"log"
)

// Server type
type Server struct{}

// Echo service
func (s *Server) Echo(ctx context.Context, in *proto.StringMessage) (*proto.StringMessage, error) {
	log.Println("Got a request")
	log.Println(ctx)
	return &proto.StringMessage{Value: "Hello From a GRPC Method (GRPC WEB Go Server Served) " + in.Value}, nil
}
