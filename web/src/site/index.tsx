import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EchoServiceApi } from '../api/api'
import { sysConfig } from '../common/sysconfig'
import { Site } from './Site';
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router
} from 'react-router-dom'
// Import once rxjs to add every core RxJS operator to the Observable prototype.
// https://redux-observable.js.org/docs/Troubleshooting.html
import 'rxjs';

import { configureStore } from './store'

sysConfig.restURL = window['appConfig']['restURL']
sysConfig.recaptchaKey = window['appConfig']['recaptchaKey']

setTimeout(() => {
  const echoApi = new EchoServiceApi(undefined, sysConfig.restURL)
  echoApi.echo({ 'body': { value: 'qwe' } })
}, 1000)

const rootNode = document.getElementById("root")
const render = rootNode.childNodes.length > 0 ? ReactDOM.hydrate : ReactDOM.render


const store = configureStore()
const App = (props) => {
  return (
    <Provider store={store}>
      <Router>
        <Site />
      </Router>
    </Provider>
  )
}
render(<App />, rootNode as HTMLElement)

