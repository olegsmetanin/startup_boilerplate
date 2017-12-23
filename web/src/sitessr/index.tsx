import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EchoServiceApi} from '../api/api'
import * as ReactDOMServer from 'react-dom/server';

import * as fs from 'fs'

const App = (props) => {
    return <div>Hello</div>
}

const html = (ssr, vendorjs, sitejs) => `<!doctype html>
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
    </head>
    <body>
        <!--[if lte IE 9]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]-->

        <div id="root">${ssr}</div>

        <script src="${vendorjs}"></script>

        <script>
          var ssr = ${ssr !== ''};
        </script>

        <script src="${sitejs}"></script>

       <!-- Google Analytics: change UA-XXXXX-Y to be your site's ID. -->
        <script>
            window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;
            ga('create','UA-XXXXX-Y','auto');ga('send','pageview')
        </script>
        <script src="https://www.google-analytics.com/analytics.js" async defer></script>
    </body>
</html>
`


export default function(locals, callback) {

    const ssr = ReactDOMServer.renderToString(
        <App />
    )

    const vendorjs = locals.vendormeta.vendor.js

    const sitejs = locals.sitemeta.site.js

    callback(null, {
        '/index.html': html(ssr, vendorjs, sitejs),
        '/index.logined.html': html('', vendorjs, sitejs)
    })

}

