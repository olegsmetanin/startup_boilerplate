package sitesvc

import (
	"encoding/json"
	"io/ioutil"
	"log"

	utils "github.com/olegsmetanin/startup_boilerplate/srv/utils"
)

// SiteMeta struct
type SiteMeta struct {
	Site struct {
		JS  string `json:"js"`
		CSS string `json:"css"`
	} `json:"site"`
}

// AppMeta struct
type AppMeta struct {
	App struct {
		JS string `json:"js"`
		//CSS string `json:"css"`
	} `json:"app"`
}

// VendorMeta struct
type VendorMeta struct {
	Vendor struct {
		JS string `json:"js"`
	} `json:"vendor"`
}

func readSSR() string {
	ssrHTML, err := ioutil.ReadFile("./web/dist/index.ssr.html")
	if err != nil {
		if isDevelopmentMode {
			log.Printf("failed reading data from file: %s", err)
		} else {
			log.Panicf("failed reading data from file: %s", err)
		}
	}

	return string(ssrHTML)
}

func readAssetsMeta() (string, string, string, string) {

	var siteMeta SiteMeta
	var vendorMeta VendorMeta
	var appMeta AppMeta
	vendorMetaFile, err := ioutil.ReadFile("./web/dist/vendormeta.json")
	err = json.Unmarshal(vendorMetaFile, &vendorMeta)

	if err != nil {
		if isDevelopmentMode {
			log.Printf("failed reading data from file: %s", err)
		} else {
			log.Panicf("failed reading data from file: %s", err)
		}
	}

	siteMetaFile, err := ioutil.ReadFile("./web/dist/sitemeta.json")
	err = json.Unmarshal(siteMetaFile, &siteMeta)

	if err != nil {
		if isDevelopmentMode {
			log.Printf("failed reading data from file: %s", err)
		} else {
			log.Panicf("failed reading data from file: %s", err)
		}
	}

	appMetaFile, err := ioutil.ReadFile("./web/dist/appmeta.json")
	err = json.Unmarshal(appMetaFile, &appMeta)

	if err != nil {
		if isDevelopmentMode {
			log.Printf("failed reading data from file: %s", err)
		} else {
			log.Panicf("failed reading data from file: %s", err)
		}
	}

	return vendorMeta.Vendor.JS, siteMeta.Site.JS, siteMeta.Site.CSS, appMeta.App.JS
}

var isDevelopmentMode = utils.GetEnv("GO_MODE", "") == "development"
var restURL = utils.GetEnv("REST_URL", "")
var recaptcha = utils.GetEnv("RECAPTCHA_KEY", "")

var ssr = readSSR()
var vendorjs, sitejs, sitecss, appjs = readAssetsMeta()

// RenderHTML renders html
func RenderHTML(isAuthenticated bool) string {
	log.Println("Render html")

	if isDevelopmentMode {
		ssr = readSSR()
		vendorjs, sitejs, sitecss, appjs = readAssetsMeta()
	}

	includessr := ""
	includejs := appjs
	includecss := ""
	if !isAuthenticated {
		includessr = ssr
		includejs = sitejs
		includecss = `<link rel="stylesheet" href="` + sitecss + `">`
	}

	return `<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Startup boilerplate</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="manifest" href="site.webmanifest">
        <link rel="apple-touch-icon" href="icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="normalize.css">
        ` + includecss + `
    </head>
    <body>
        <!--[if lte IE 9]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]-->

        <div id="root">` + includessr + `</div>

        <script src="` + vendorjs + `"></script>

        <script>
          var appConfig = {
			      restURL: "` + restURL + `",
			      recaptchaKey: "` + recaptcha + `",
		      }
		    </script>

        <script src="` + includejs + `"></script>

        <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>

        <!-- Google Analytics: change UA-XXXXX-Y to be your site's ID. -->
        <script>
            window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;
            ga('create','UA-XXXXX-Y','auto');ga('send','pageview')
        </script>
        <script src="https://www.google-analytics.com/analytics.js" async defer></script>
    </body>
</html>
`
}
