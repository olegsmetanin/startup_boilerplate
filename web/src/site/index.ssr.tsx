import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { sysConfig } from '../common/sysconfig'
import { Site } from './Site';
import { StaticRouter } from 'react-router'

export default function(locals, callback) {

  sysConfig.restURL = locals.env["REST_URL"]
  sysConfig.recaptchaKey = locals.env["RECAPTCHA_KEY"]

  const context = {}

  const ssr = ReactDOMServer.renderToString(
    <StaticRouter
      location={'/'}
      context={context}
    >
      <Site />
    </StaticRouter>
  )

  callback(null, {
    '../index.ssr.html': ssr
  })

}

