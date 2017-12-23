package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	log.Println("Hello site")

	r := mux.NewRouter()
	r.PathPrefix("/").Methods("GET").Handler(http.StripPrefix("/", http.FileServer(http.Dir("./web/dist/public"))))

	// Bind to a port and pass our router in
	log.Fatal(http.ListenAndServe(":8080", r))
}
