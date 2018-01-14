package apisvc

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"

	utils "github.com/olegsmetanin/startup_boilerplate/srv/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
)

var (
	siteURL = utils.GetEnv("SITE_URL", "")
	restURL = utils.GetEnv("REST_URL", "")

	oauthConf = &oauth2.Config{
		ClientID:     utils.GetEnv("AUTH_FB_APPID", ""),
		ClientSecret: utils.GetEnv("AUTH_FB_APPSECRET", ""),
		RedirectURL:  restURL + "/extauth/fb/callback",
		Scopes:       []string{"public_profile"},
		Endpoint:     facebook.Endpoint,
	}
	oauthStateString = "thisshouldberandom"
)

// HandleFBLogin service
func HandleFBLogin(w http.ResponseWriter, r *http.Request) {
	URL, err := url.Parse(oauthConf.Endpoint.AuthURL)
	if err != nil {
		log.Fatal("Parse: ", err)
	}
	parameters := url.Values{}
	parameters.Add("client_id", oauthConf.ClientID)
	parameters.Add("scope", strings.Join(oauthConf.Scopes, " "))
	parameters.Add("redirect_uri", oauthConf.RedirectURL)
	parameters.Add("response_type", "code")
	parameters.Add("state", oauthStateString)
	URL.RawQuery = parameters.Encode()
	url := URL.String()
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// HandleFBCallback func
func HandleFBCallback(w http.ResponseWriter, r *http.Request) {
	state := r.FormValue("state")
	if state != oauthStateString {
		fmt.Printf("invalid oauth state, expected '%s', got '%s'\n", oauthStateString, state)
		http.Redirect(w, r, siteURL, http.StatusTemporaryRedirect)
		return
	}

	code := r.FormValue("code")

	token, err := oauthConf.Exchange(oauth2.NoContext, code)
	if err != nil {
		fmt.Printf("oauthConf.Exchange() failed with '%s'\n", err)
		http.Redirect(w, r, siteURL, http.StatusTemporaryRedirect)
		return
	}

	resp, err := http.Get("https://graph.facebook.com/me?access_token=" +
		url.QueryEscape(token.AccessToken))
	if err != nil {
		fmt.Printf("Get: %s\n", err)
		http.Redirect(w, r, siteURL, http.StatusTemporaryRedirect)
		return
	}
	defer resp.Body.Close()

	response, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("ReadAll: %s\n", err)
		http.Redirect(w, r, siteURL, http.StatusTemporaryRedirect)
		return
	}

	log.Printf("parseResponseBody: %s\n", string(response))

	http.SetCookie(w, &http.Cookie{Name: "auth", Value: "qwe", Path: "/"})
	http.Redirect(w, r, siteURL, http.StatusFound)
}
