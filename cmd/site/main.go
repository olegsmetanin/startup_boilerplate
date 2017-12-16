package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/olegsmetanin/startup_boilerplate/srv/common"
)

// PrimitiveHandler of service
func PrimitiveHandler(w http.ResponseWriter, r *http.Request) {
	// Response
	w.Write([]byte("This is site"))
	w.Write([]byte(common.Fn1()))
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func main() {

	log.Println("Hello site")

	r := mux.NewRouter()
	// Base path for api
	basePath := getEnv("URL_BASE_PATH", "/")
	// Routes consist of a path and a handler function.
	r.HandleFunc(basePath, PrimitiveHandler)

	// Bind to a port and pass our router in
	log.Fatal(http.ListenAndServe(":8080", r))
}
