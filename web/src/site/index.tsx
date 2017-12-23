import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EchoServiceApi} from '../api/api'
//import {App} from './App';

const App = (props) => {
    return <div>Hello</div>
}

setTimeout(() => {
    const echoApi = new EchoServiceApi(undefined, 'http://localhost:8082')
    echoApi.echo({'body': {value: 'qwe'}})
}, 1000)

if (window['ssr']) {
    ReactDOM.hydrate(
        <App />,
        document.getElementById('root') as HTMLElement
    );
} else {
    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    )
}

