import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { sysConfig } from '../common/sysconfig'
import { Site } from '../site/Site';
import { StaticRouter } from 'react-router'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
const htmlTemplate = require('./index.site.ejs')

export function ssr(state: any) {

  const context = {}

  const sheet = new ServerStyleSheet()

  const html = ReactDOMServer.renderToString(
    <StaticRouter
      location={'/'}
      context={context}
    >
    <StyleSheetManager sheet={sheet.instance}>
      <Site />
    </StyleSheetManager>
    </StaticRouter>
  )

  const style = sheet.getStyleTags()

  //const STATIC_CONTEXT=process.env.STATIC_CONTEXT || '/'

  return htmlTemplate({html, style})
}