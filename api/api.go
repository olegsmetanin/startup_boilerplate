package api

import (
	sp "github.com/olegsmetanin/startup_boilerplate/serviceproto/go"
	"golang.org/x/net/context"
	"log"
)

type Server struct{}

// Echo service
func (s *Server) Echo(ctx context.Context, in *sp.StringMessage) (*sp.StringMessage, error) {
	log.Println("Got a request")
	log.Println(ctx)
	return &sp.StringMessage{Value: "Hello From a GRPC Method (GRPC WEB Go Server Served) " + in.Value}, nil
}
