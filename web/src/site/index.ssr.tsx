import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { sysConfig } from '../common/sysconfig'
import { Site } from './Site';
import { StaticRouter } from 'react-router'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function(locals, callback) {

  sysConfig.restURL = locals.env["REST_URL"]
  sysConfig.recaptchaKey = locals.env["RECAPTCHA_KEY"]

  const context = {}

  const sheet = new ServerStyleSheet()

  const ssr = ReactDOMServer.renderToString(
    <StaticRouter
      location={'/'}
      context={context}
    >
    <StyleSheetManager sheet={sheet.instance}>
      <Site />
    </StyleSheetManager>
    </StaticRouter>
  )

  const styleTags = sheet.getStyleTags()
  console.log("styleTags", styleTags)

  callback(null, {
    '../index.ssr.html': ssr
  })

}

