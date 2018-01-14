import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EchoServiceApi } from '../api/api'
import { sysConfig } from '../common/sysconfig'
import { Site } from './Site';

import {
  BrowserRouter as Router
} from 'react-router-dom'

sysConfig.restURL = window['appConfig']['restURL']
sysConfig.recaptchaKey = window['appConfig']['recaptchaKey']

setTimeout(() => {
  const echoApi = new EchoServiceApi(undefined, sysConfig.restURL)
  echoApi.echo({ 'body': { value: 'qwe' } })
}, 1000)

const rootNode = document.getElementById("root")
const render = rootNode.childNodes.length > 0 ? ReactDOM.hydrate : ReactDOM.render
const App = (props) => {
  return (
    <Router>
      <Site />
    </Router>
  )
}
render(<App />, rootNode as HTMLElement)

