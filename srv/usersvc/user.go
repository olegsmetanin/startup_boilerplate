package usersvc

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	proto "github.com/olegsmetanin/startup_boilerplate/srv/proto"
	"github.com/satori/go.uuid"
	"golang.org/x/net/context"
	"log"
	"time"
)

// Server type
type Server struct {
	DB *gorm.DB
}

// User type
type User struct {
	ID        uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	Username  string
	Email     string
	Firstname string
	Lastname  string

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

// RegisterUser service
func (s *Server) RegisterUser(ctx context.Context, in *proto.RegisterUserRequest) (*proto.RegisterUserResponse, error) {
	log.Println("Got a request in user service")
	log.Println(ctx)
	return &proto.RegisterUserResponse{Id: "qwe"}, nil
}
