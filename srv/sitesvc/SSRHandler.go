package sitesvc

import (
	"net/http"
	"net/http/httputil"

	"github.com/gorilla/mux"
)

func SSRHandler(p *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = mux.Vars(r)["rest"]
		p.ServeHTTP(w, r)
	}
}
