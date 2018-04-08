package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gorilla/mux"
)

func main() {
	log.Println("SiteService: started")
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	r := mux.NewRouter()

	//fileServer := http.FileServer(http.Dir("./web/dist/public"))

	target := "http://ssrsvc:8080"
	remote, err := url.Parse(target)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	// proxyHandler := sitesvc.SSRHandler(proxy)

	r.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)

		// if r.URL.Path == "/" {
		// 	var isAuthenticated = true
		// 	authCookie, err := r.Cookie("auth")

		// 	log.Println("Cookie:", authCookie)
		// 	if err != nil {
		// 		isAuthenticated = false
		// 	}

		// 	w.Write([]byte(sitesvc.RenderHTML(isAuthenticated)))
		// } else {
		// 	fileServer.ServeHTTP(w, r)
		// }

	}))

	// Bind to a port and pass our router in
	log.Fatal(http.ListenAndServe(":8080", r))
}
