package sitesvc

import (
	"io/ioutil"
	"log"

	utils "github.com/olegsmetanin/startup_boilerplate/srv/utils"
)

func readSiteIndexHTML() string {
	ssrHTML, err := ioutil.ReadFile("./web/dist/index.site.html")
	if err != nil {
		if isDevelopmentMode {
			log.Printf("failed reading data from file: %s", err)
		} else {
			log.Panicf("failed reading data from file: %s", err)
		}
	}

	return string(ssrHTML)
}

var isDevelopmentMode = utils.GetEnv("GO_MODE", "") == "development"
var restURL = utils.GetEnv("REST_URL", "")
var recaptcha = utils.GetEnv("RECAPTCHA_KEY", "")

var siteIndexHTML = readSiteIndexHTML()

// RenderHTML renders html
func RenderHTML(isAuthenticated bool) string {
	log.Println("Render html")

	if isDevelopmentMode {
		siteIndexHTML = readSiteIndexHTML()
	}

	return siteIndexHTML

}
