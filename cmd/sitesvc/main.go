package main

import (
	"github.com/gorilla/mux"
	sitesvc "github.com/olegsmetanin/startup_boilerplate/srv/sitesvc"
	"log"
	"net/http"
)

func main() {
	log.Println("SiteService started")
	r := mux.NewRouter()

	fileServer := http.FileServer(http.Dir("./web/dist/public"))

	r.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			var isAuthenticated = true
			authCookie, err := r.Cookie("auth")

			log.Println("Cookie:", authCookie)
			if err != nil {
				isAuthenticated = false
			}

			w.Write([]byte(sitesvc.RenderHTML(isAuthenticated)))
		} else {
			fileServer.ServeHTTP(w, r)
		}
	}))

	// Bind to a port and pass our router in
	log.Fatal(http.ListenAndServe(":8080", r))
}
