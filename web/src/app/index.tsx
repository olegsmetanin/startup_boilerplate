import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EchoServiceApi} from '../api/api'
import {sysConfig} from '../common/sysconfig'
import {App} from './App';

sysConfig.restURL = window["restURL"]

const rootNode = document.getElementById("root")
const render = ReactDOM.render

render(<App />, rootNode as HTMLElement)

